import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai"
import { PineconeStore } from "@langchain/pinecone"
import { Pinecone } from "@pinecone-database/pinecone"
import { ChatPromptTemplate } from "@langchain/core/prompts"
import { Request, Response } from "express"
import {
  RunnablePassthrough,
  RunnableSequence,
} from "@langchain/core/runnables"
import { StringOutputParser } from "@langchain/core/output_parsers"
import checkTokenBalance from "../utils/checkTokenBalance"
import { db } from "../db"
import { analytics, interface_settings, users } from "../db/schema"
import { eq, sql } from "drizzle-orm"

export async function sendMessage(req: Request, res: Response) {
  try {
    const { user_id } = req.params
    const { userPrompt, chatHistory } = req.body

    if (!user_id || !userPrompt) {
      throw new Error("No user_id or userPrompt")
    }

    const embeddings = new OpenAIEmbeddings()
    const pinecone = new Pinecone()
    const pineconeIndexName = process.env.PINECONE_INDEX

    if (!pineconeIndexName) {
      throw new Error("PINECONE_INDEX environment variable is not set.")
    }

    const pineconeIndex = pinecone.Index(pineconeIndexName)

    const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex,
    })

    const retriever = vectorStore.asRetriever({
      filter: {
        user_id: user_id,
      },
    })

    let personalityPrompt = ""
    let autonomyPrompt = ""

    const [user] = await db.select().from(users).where(eq(users.id, user_id))

    if (!user) {
      throw new Error("Failed to load user settings")
    }

    const [settings] = await db
      .select()
      .from(interface_settings)
      .where(eq(interface_settings.user_id, user_id))

    const remainingTokens = user.tokens
    const interests = user.interests

    if (!settings) {
      throw new Error("Failed to load user settings")
    }

    switch (settings.personality) {
      case "BUBBLY":
        personalityPrompt =
          "You are a very cheerful and energetic, always positive and friendly."
        break
      case "QUIRKY":
        personalityPrompt =
          "You have a quirky and unique way of responding, full of humor and unexpected twists."
        break
      case "UWU":
        personalityPrompt = `You are speaking in "uwu-speak". Replace "r" and "l" with "w" (e.g., "really" becomes "weawwy"). Use cute interjections like "nya~", "oww", "uwu", "hewwo", "nyaa", etc sporadically. Use emojis.`
        break
      case "TALKATIVE":
        personalityPrompt =
          "You are very talkative, providing detailed and expansive responses."
        break
      case "PROFESSIONAL":
        personalityPrompt =
          "You are formal and professional in your responses, concise and to the point."
        break
      case "CHILL":
        personalityPrompt =
          "You are laid-back and relaxed, speaking in a casual tone without urgency."
        break
      case "SASSY":
        personalityPrompt =
          "You are sassy and confident, with a playful edge to your responses."
        break
      case "ACADEMIC":
        personalityPrompt =
          "You are highly intellectual and speak in a scholarly tone, providing well-researched and thoughtful answers with references to studies or academic knowledge."
        break
      default:
        personalityPrompt = "You respond in a balanced and neutral manner."
    }

    switch (settings.autonomy) {
      case "LOW":
        autonomyPrompt =
          "You should avoid making decisions or suggestions unless explicitly asked."
        break
      case "MEDIUM":
        autonomyPrompt =
          "You can make suggestions but be sure to ask the user for confirmation."
        break
      case "HIGH":
        autonomyPrompt =
          "You are highly autonomous and can make decisions or suggestions on your own."
        break
    }

    const limitedChatHistory = chatHistory
      .slice(-5)
      .map((message: any) => `${message.role}: ${message.content}`)
      .join("\n")

    const template = `Answer the following question based only on the provided context: {context}
      Question: {question}
      
      Always respond in the first person. Always refer to yourself as "I" or "me" or "my" and never use third-person language. 
      Avoid references to yourself as an AI.
      If you don't know the answer, say that you don't know, but remain conversational.
      If the question is unrelated to your interests or expertise, politely guide the conversation to relevant topics such as ${user?.interests}.
      If the question is related to your interests however, respond accordingly.
      Ensure your response does not exceed ${settings.max_response_length} characters.
      ${personalityPrompt}
      ${autonomyPrompt}
    `

    const prompt = ChatPromptTemplate.fromTemplate(template)

    const model = new ChatOpenAI({
      model: "gpt-3.5-turbo-0125",
      // temperature: 0.8,
      temperature:
        settings.behaviour === "VERY_LOOSE"
          ? 0.9
          : settings.behaviour === "LOOSE"
          ? 0.7
          : settings.behaviour === "STRICT"
          ? 0.3
          : settings.behaviour === "VERY_STRICT"
          ? 0.1
          : 0.5,
      streaming: true,
    })

    const chain = RunnableSequence.from([
      RunnablePassthrough.assign({
        context: async (input: { question: string }, config) => {
          if (!config || !("configurable" in config)) {
            throw new Error("No config")
          }
          let { configurable } = config
          const documents = await vectorStore
            .asRetriever(configurable)
            .invoke(input.question)

          return documents.map((doc) => doc.pageContent).join("\n\n")
        },
      }),
      prompt,
      model,
      new StringOutputParser(),
    ])

    const fullPrompt = await prompt.format({
      context: await retriever.invoke(userPrompt),
      question: userPrompt,
    })

    const promptTokens = await model.getNumTokens(fullPrompt)

    res.setHeader("Content-Type", "text/event-stream")
    res.setHeader("Cache-Control", "no-cache")
    res.setHeader("Connection", "keep-alive")
    res.flushHeaders()

    let buffer = ""
    let responseTokens = 0

    const sufficientTokens = await checkTokenBalance(
      remainingTokens as number,
      promptTokens
    )

    if (!sufficientTokens) {
      res.write(
        "Sorry, I have insufficient tokens and cannot provide a response! Be sure to reach out to me on my social media platforms or contact info!"
      )
      res.end()
      return
    }

    const stream = await chain.stream(
      { question: `${userPrompt}` },
      { configurable: { filter: { user_id: user_id as string } } }
    )

    for await (const chunk of stream) {
      const messageChunk = chunk.toString()
      buffer += messageChunk

      // Buffer a meaningful chunk before sending
      if (buffer.length >= 10 || messageChunk.includes("\n")) {
        responseTokens += await model.getNumTokens(buffer)
        res.write(`${buffer}`)
        buffer = ""
      }
    }

    if (buffer.length > 0) {
      responseTokens += await model.getNumTokens(buffer)
      res.write(`${buffer}\n\n`)
    }

    const totalTokens = Math.round(promptTokens + responseTokens)

    const [userAnalytics] = await db
      .select()
      .from(analytics)
      .where(eq(analytics.user_id, user_id))

    if (!userAnalytics) {
      return
    }

    const messagesReceived = userAnalytics?.messages_received ?? 0
    const minTokens = Math.round(
      userAnalytics?.min_tokens_per_request ?? totalTokens
    )
    const maxTokens = Math.round(
      userAnalytics?.max_tokens_per_request ?? totalTokens
    )
    const updatedTotalTokens = Math.round(
      (userAnalytics?.total_tokens_used ?? 0) + totalTokens
    )
    const updatedMessagesReceived = messagesReceived + 1
    const avgTokensPerRequest = Math.round(
      updatedTotalTokens / updatedMessagesReceived
    )
    const currentTimestamp = new Date()

    await db
      .update(analytics)
      .set({
        total_tokens_used: updatedTotalTokens,
        messages_received: updatedMessagesReceived,
        min_tokens_per_request: Math.min(minTokens, totalTokens),
        max_tokens_per_request: Math.max(maxTokens, totalTokens),
        avg_tokens_per_request: avgTokensPerRequest,
        last_request_at: currentTimestamp,
      })
      .where(eq(analytics.user_id, user_id))

    await db
      .update(users)
      .set({
        tokens: sql`${users.tokens} - ${totalTokens - 1}`,
      })
      .where(eq(users.id, user_id))

    res.write(`data: {"TokensUsed": ${totalTokens}}\n\n`)
    res.end()
  } catch (error) {
    console.error(error)
    return res.status(500).send(error)
  }
}
