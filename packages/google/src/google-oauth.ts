import { AccessTokenRespnoseOptions, AuthUser, Client, OAuth, OAuth2 } from '@openauth/core'
import { stringify } from 'querystring'

import { GoogleClient } from './google-client'

export class GoogleOAuth extends OAuth2 implements OAuth {

  authRequestUri(): string {
    return 'https://accounts.google.com/o/oauth2/v2/auth'
  }

  accessTokenRequestUri(): string {
    return 'https://oauth2.googleapis.com/token'
  }

  buildScopes(scopes: string[]): string {
    return scopes.join(' ')
  }

  createClient(accessToken?: string): Client {
    return new GoogleClient(this._axiosClient, accessToken)
  }

  async requestAccessToken(code: string, options: AccessTokenRespnoseOptions = {}): Promise<Record<string, any>> {
    const { data } = await this._axiosClient.post(this.accessTokenRequestUri(), stringify(this.getAccessTokenFields(code, options)))
    return data
  }

  async getAuthUser(accessToken: string): Promise<AuthUser> {
    const { data } = await this.getClient(accessToken).get<{
      email: string,
      email_verified: boolean,
      family_name: string,
      given_name: string,
      locale: string,
      name: string,
      picture: string,
      sub: string,
    }>('oauth2/v3/userinfo')
    return {
      id: data.sub,
      name: data.name,
      email: data.email,
      avatar: data.picture,
      raw: data,
    }
  }
}
