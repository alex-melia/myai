export const runtime = "edge"

export async function GET(request: Request) {
  let responseText = "Hello World"
  return new Response(responseText)
}
