import axios, { AxiosInstance } from 'axios'

import { BaseClient } from './base-client'
import { assignQuery } from './helpers'
import {
  AccessTokenRespnoseOptions,
  AccessTokenResponse,
  AuthRequestUriOptions,
  AuthUser,
  Client,
  OAuth,
  OAuthOptions,
} from './interfaces/oauth'

export class OAuth2 implements OAuth {

  _axiosClient: AxiosInstance = axios
  _unauthClient?: Client

  constructor(public options: OAuthOptions) {
  }

  authRequestUri(): string {
    throw new TypeError('It must be implemented.')
  }

  accessTokenRequestUri(): string {
    throw new TypeError('It must be implemented.')
  }

  buildScopes(scopes: string[]): string {
    return scopes.join(',')
  }

  getAuthRequestFiels(options: AuthRequestUriOptions = {}): Record<string, any> {
    const scope = options.scope ?? this.options.scope
    return {
      response_type: options.responseType ?? 'code',
      client_id: options.clientId ?? this.options.clientId,
      redirect_uri: options.redirectUri ?? this.options.redirectUri,
      state: options.state,
      scope: scope ? this.buildScopes(Array.isArray(scope) ? scope : [scope]) : null,
    }
  }

  /**
   * @see https://tools.ietf.org/html/rfc6749#section-2.3.1
   * @see https://tools.ietf.org/html/rfc6749#section-4.1.3
   */
  async requestAccessToken(code: string, options: AccessTokenRespnoseOptions = {}): Promise<Record<string, any>> {
    const { data } = await this._axiosClient.get(
      assignQuery(this.accessTokenRequestUri(), this.getAccessTokenFields(code, options))
    )
    return data
  }

  getAccessTokenFields(code: string, options: AccessTokenRespnoseOptions = {}): Record<string, any> {
    return {
      client_id: this.options.clientId,
      client_secret: this.options.clientSecret,
      redirect_uri: this.options.redirectUri,
      code,
      grant_type: 'authorization_code',
    }
  }

  /**
   * @see https://tools.ietf.org/html/rfc6749#section-4.1.4
   */
  mapDataToAccessTokenResponse(body: Record<string, any>): AccessTokenResponse {
    return {
      accessToken: body.access_token,
      tokenType: body.token_type,
      expiresIn: body.expires_in,
      refreshToken: body.refresh_token,
    }
  }

  createClient(accessToken?: string): Client {
    return new BaseClient(this._axiosClient, accessToken)
  }

  /**
   * @see https://tools.ietf.org/html/rfc6749#section-4.1.1
   */
  getAuthRequestUri(options: AuthRequestUriOptions = {}): Promise<string> {
    return Promise.resolve(assignQuery(this.authRequestUri(), this.getAuthRequestFiels(options)))
  }

  async getAccessTokenResponse(code: string, options: AccessTokenRespnoseOptions = {}): Promise<AccessTokenResponse> {
    return this.mapDataToAccessTokenResponse(await this.requestAccessToken(code, options))
  }

  getClient(accessToken?: string): Client {
    if (!accessToken) {
      return this._unauthClient ?? (this._unauthClient = this.createClient())
    }
    return this.createClient(accessToken)
  }

  getAuthUser(accessToken: string): Promise<AuthUser> {
    throw new TypeError('It must be implemented.')
  }
}
