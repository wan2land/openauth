
export interface OAuth {
  getAuthRequestUri(): string
  getAccessTokenResponse(code: string): Promise<AccessTokenResponse>
  getAuthUser(accessToken: string): Promise<AuthUser>
}

export interface OAuthOptions {
  clientId: string
  clientSecret: string
  redirectUri: string
  code?: string
  scope?: string[] | string
}

export interface AccessTokenResponse {
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
