import axios, { AxiosInstance } from 'axios'

import { createUri, underscoreToCamel } from './helpers'
import { AccessTokenResponse, AuthUser, OAuthOptions } from './interfaces/oauth'

export class BaseOAuth {

  constructor(
    public options: OAuthOptions,
    public client: AxiosInstance = axios.create(),
  ) {}

  authRequestUri(): string {
    throw new TypeError('It must be implemented.')
  }

  accessTokenRequestUri(): string {
    throw new TypeError('It must be implemented.')
  }

  apiRequestUri(path: string): string {
    throw new TypeError('It must be implemented.')
  }

  authUserPath(): string {
    throw new TypeError('It must be implemented.')
  }

  buildScopes(scopes: string[]): string {
    return scopes.join(',')
  }

  /**
   * @see https://tools.ietf.org/html/rfc6749#section-2.3.1
   * @see https://tools.ietf.org/html/rfc6749#section-4.1.3
   */
  async requestAccessToken(code: string): Promise<Record<string, any>> {
    const { data } = await this.client.get(createUri(this.accessTokenRequestUri(), {
      clientId: this.options.clientId,
      clientSecret: this.options.clientSecret,
      redirectUri: this.options.redirectUri,
      code,
      grantType: 'authorization_code',
    }))
    return data
  }

  /**
   * @see https://tools.ietf.org/html/rfc6749#section-4.1.4
   */
  buildAccessTokenResponse(body: Record<string, any>): AccessTokenResponse {
    return underscoreToCamel(body) as AccessTokenResponse
  }

  buildAuthUserResponse(body: Record<string, any>): AuthUser {
    return underscoreToCamel(body) as AuthUser
  }

  async authGet(accessToken: string, path: string, params: Record<string, any> = {}): Promise<Record<string, any>> {
    const { data } = await this.client.get(createUri(this.apiRequestUri(path), {
      accessToken,
      ...params,
    }))
    return underscoreToCamel(data)
  }

  /**
   * @see https://tools.ietf.org/html/rfc6749#section-4.1.1
   */
  getAuthRequestUri(state?: string): string {
    return createUri(this.authRequestUri(), {
      responseType: 'code',
      clientId: this.options.clientId,
      redirectUri: this.options.redirectUri,
      state,
      scope: this.options.scope ? this.buildScopes(Array.isArray(this.options.scope) ? this.options.scope : [this.options.scope]) : null,
    })
  }

  async getAccessTokenResponse(code: string): Promise<AccessTokenResponse> {
    return this.buildAccessTokenResponse(await this.requestAccessToken(code))
  }

  async getAuthUser(accessToken: string): Promise<AuthUser> {
    return this.buildAuthUserResponse(await this.authGet(accessToken, this.authUserPath()))
  }
}
