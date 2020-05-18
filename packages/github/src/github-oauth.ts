import { AccessTokenRespnoseOptions, AccessTokenResponse, AuthUser, Client, OAuth, OAuth2 } from '@openauth/core'
import { parse, stringify } from 'querystring'

import { GithubClient } from './github-client'

export class GithubOAuth extends OAuth2 implements OAuth {

  authRequestUri(): string {
    return 'https://github.com/login/oauth/authorize'
  }

  accessTokenRequestUri(): string {
    return 'https://github.com/login/oauth/access_token'
  }

  buildScopes(scopes: string[]): string {
    return scopes.join(' ')
  }

  createClient(accessToken?: string): Client {
    return new GithubClient(this._axiosClient, accessToken)
  }

  async requestAccessToken(code: string, options: AccessTokenRespnoseOptions = {}): Promise<Record<string, any>> {
    const { data } = await this._axiosClient.post(this.accessTokenRequestUri(), stringify(this.getAccessTokenFields(code, options)))
    return parse(data)
  }

  getAccessTokenFields(code: string, options: AccessTokenRespnoseOptions = {}): Record<string, any> {
    return {
      client_id: this.options.clientId,
      client_secret: this.options.clientSecret,
      redirect_uri: this.options.redirectUri,
      code,
      ...(options.state ? { state: options.state } : {}),
    }
  }

  mapDataToAccessTokenResponse(body: Record<string, any>): AccessTokenResponse {
    return {
      accessToken: body.access_token,
      tokenType: body.token_type,
      expiresIn: +body.expires_in,
      refreshToken: body.refresh_token,
    }
  }

  async getAuthUser(accessToken: string): Promise<AuthUser> {
    const { data } = await this.getClient(accessToken).get<{ id: number, name?: string, email?: string, avatar_url?: string }>('user')
    return {
      id: `${data.id}`,
      name: data.name,
      email: data.email,
      avatar: data.avatar_url,
      raw: data,
    }
  }
}
