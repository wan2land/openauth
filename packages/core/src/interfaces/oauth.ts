
export interface OAuth {
  getAuthRequestUri(options?: AuthRequestUriOptions): Promise<string>
  getAccessTokenResponse(code: string, options?: AccessTokenRespnoseOptions): Promise<AccessTokenResponse>
  getAuthUser(accessToken: string): Promise<AuthUser>
  getClient(accessToken?: string): Client
}

export type ClientPath = string | { path: string, query: Record<string, any> }

export interface Client {
  get<TData = any, THeaders = Record<string, string | string[]>>(path: ClientPath, headers?: Record<string, any>): Promise<{ headers: THeaders, data: TData }>
  post<TData = any, THeaders = Record<string, string | string[]>>(path: ClientPath, params?: Record<string, any>, headers?: Record<string, any>): Promise<{ headers: THeaders, data: TData }>
  put<TData = any, THeaders = Record<string, string | string[]>>(path: ClientPath, params?: Record<string, any>, headers?: Record<string, any>): Promise<{ headers: THeaders, data: TData }>
  delete<TData = any, THeaders = Record<string, string | string[]>>(path: ClientPath, params?: Record<string, any>, headers?: Record<string, any>): Promise<{ headers: THeaders, data: TData }>
  request<TData = any, THeaders = Record<string, string | string[]>>(method: string, path: ClientPath, params?: Record<string, any>, headers?: Record<string, any>): Promise<{ headers: THeaders, data: TData }>
}

export interface OAuthOptions {
  clientId: string
  clientSecret: string
  redirectUri: string
  code?: string
  scope?: string[] | string
}

export interface AuthRequestUriOptions {
  responseType?: string
  clientId?: string
  redirectUri?: string
  scope?: string[] | string
  state?: string
}

export interface AccessTokenRespnoseOptions {
  clientId?: string
  clientSecret?: string
  redirectUri?: string
  state?: string
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
