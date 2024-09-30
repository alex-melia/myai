export default async function checkTokenBalance(
  remainingTokens: number,
  promptTokens: number
) {
  if (remainingTokens < promptTokens) {
    return false
  }
  return true
}
