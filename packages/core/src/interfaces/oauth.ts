
export interface OAuth {
  getAuthRequestUri(options?: AuthRequestUriOptions): Promise<string>
  getAccessTokenResponse(code: string): Promise<AccessTokenResponse>
  getAuthUser(accessToken: string): Promise<AuthUser>
  getClient(accessToken?: string): Client
}

export type ClientPath = string | { path: string, query: Record<string, any> }

export interface Client {
  get<TData = any>(path: ClientPath, headers?: Record<string, any>): Promise<{ headers: any, data: TData }>
  post<TData = any>(path: ClientPath, params?: Record<string, any>, headers?: Record<string, any>): Promise<{ headers: any, data: TData }>
  put<TData = any>(path: ClientPath, params?: Record<string, any>, headers?: Record<string, any>): Promise<{ headers: any, data: TData }>
  delete<TData = any>(path: ClientPath, params?: Record<string, any>, headers?: Record<string, any>): Promise<{ headers: any, data: TData }>
  request<TData = any>(method: string, path: ClientPath, params?: Record<string, any>, headers?: Record<string, any>): Promise<{ headers: any, data: TData }>
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
