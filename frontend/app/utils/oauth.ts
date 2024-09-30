const MICROSOFT_AUTH_URL =
  "https://login.microsoftonline.com/common/oauth2/v2.0/authorize"
const MICROSOFT_TOKEN_URL =
  "https://login.microsoftonline.com/common/oauth2/v2.0/token"
const CLIENT_ID = process.env.NEXT_PUBLIC_MICROSOFT_CLIENT_ID!
const CLIENT_SECRET = process.env.MICROSOFT_CLIENT_SECRET!
const REDIRECT_URI = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/microsoft/callback`
const SCOPE = "User.Read offline_access Calendars.ReadWrite"

export const getMicrosoftOAuthUrl = () => {
  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: "code",
    redirect_uri: REDIRECT_URI,
    response_mode: "query",
    scope: SCOPE,
  })

  return `${MICROSOFT_AUTH_URL}?${params.toString()}`
}

// Handle sign-in flow for Microsoft OAuth
export const signInWithMicrosoft = () => {
  window.location.href = getMicrosoftOAuthUrl()
  return true // return a value indicating success
}

// Exchange authorization code for access token
export const getAccessToken = async (code: string) => {
  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    scope: SCOPE,
    code: code,
    redirect_uri: REDIRECT_URI,
    grant_type: "authorization_code",
    client_secret: CLIENT_SECRET,
  })

  try {
    const response = await fetch(MICROSOFT_TOKEN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    })

    return response.json()
  } catch (error) {
    console.error("Failed to exchange code for access token", error)
    throw new Error("Failed to exchange code for access token")
  }
}

// Refresh access token using refresh token
export const refreshAccessToken = async (refreshToken: string) => {
  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    scope: SCOPE,
    refresh_token: refreshToken,
    redirect_uri: REDIRECT_URI,
    grant_type: "refresh_token",
    client_secret: CLIENT_SECRET,
  })

  try {
    const response = await fetch(MICROSOFT_TOKEN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    })

    return response.json() // Assuming you expect a JSON response
  } catch (error) {
    console.error("Failed to refresh access token", error)
    throw new Error("Failed to refresh access token")
  }
}
