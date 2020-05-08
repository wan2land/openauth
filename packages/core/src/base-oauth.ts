import axios from 'axios'

import { createUri, underscoreToCamel } from './helpers'
import { AccessToken, AuthUser, OAuthOptions } from './interfaces/oauth'

export class BaseOAuth {

  constructor(
    public options: OAuthOptions
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
   * @see https://tools.ietf.org/html/rfc6749#section-4.1.3 (remove grant_type)
   */
  async requestAccessToken(code: string): Promise<Record<string, any>> {
    const { data } = await axios.get(createUri(this.accessTokenRequestUri(), {
      clientId: this.options.clientId,
      clientSecret: this.options.clientSecret,
      redirectUri: this.options.redirectUri,
      code,
    }))
    return data
  }

  /**
   * @see https://tools.ietf.org/html/rfc6749#section-4.1.4
   */
  buildAccessTokenResponse(body: Record<string, any>): AccessToken {
    return underscoreToCamel(body) as AccessToken
  }

  buildAuthUserResponse(body: Record<string, any>): AuthUser {
    return underscoreToCamel(body) as AuthUser
  }

  async authGet(token: AccessToken, path: string, params: Record<string, any> = {}): Promise<Record<string, any>> {
    const { data } = await axios.get(createUri(this.apiRequestUri(path), {
      accessToken: token.accessToken,
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

  async getAccessTokenResponse(code: string): Promise<AccessToken> {
    return this.buildAccessTokenResponse(await this.requestAccessToken(code))
  }

  async getAuthUser(token: AccessToken): Promise<AuthUser> {
    return this.buildAuthUserResponse(await this.authGet(token, this.authUserPath()))
  }
}
