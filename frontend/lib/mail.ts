// import { Resend } from "resend"

// const resend = new Resend(process.env.RESEND_API_KEY)

// const domain = "https://myai.bio"

// export default async function sendVerificationEmail(
//   email: string,
//   token: string
// ) {
//   try {
//     const confirmationLink = `${domain}/verify-email?token=${token}`

//     console.log(confirmationLink)

//     await resend.emails.send({
//       from: "MyAI <noreply@myai.bio>",
//       to: email,
//       subject: "Verify your email",
//       html: `<p>Click <a href="${confirmationLink}">here</a> to verify your email.</p>`,
//     })
//   } catch (error) {
//     console.log(error)
//   }
// }
