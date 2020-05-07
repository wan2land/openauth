
export interface OAuth {
  getAuthRequestUri(): string
  getAccessTokenResponse(code: string): Promise<AccessToken>
  getAuthUser(token: AccessToken): Promise<AuthUser>
}

export interface OAuthOptions {
  clientId: string
  clientSecret: string
  redirectUri: string
  code?: string
}

export interface AccessToken {
  accessToken: string
  tokenType: string
  expiresIn?: number
  refreshToken?: string
  [key: string]: any
}

export interface AuthUser {
  id: string
  nickname?: string
  name?: string
  email?: string
  avatar?: string
  raw?: any
}
