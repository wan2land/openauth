import { AccessTokenRespnoseOptions, AuthUser, Client, OAuth, OAuth2, AccessTokenResponse } from '@openauth/core'
import { stringify } from 'querystring'

import { InstagramClient } from './instagram-client'

export interface InstagramOAuthOptions {
  version?: string
  clientId: string
  redirectUri: string
  clientSecret: string
  scope: string | string[]
}

export class InstagramOAuth extends OAuth2 implements OAuth {

  authRequestUri(): string {
    return 'https://api.instagram.com/oauth/authorize'
  }

  accessTokenRequestUri(): string {
    return 'https://api.instagram.com/oauth/access_token'
  }

  createClient(accessToken?: string): Client {
    return new InstagramClient(this._axiosClient, accessToken)
  }

  async requestAccessToken(code: string, options: AccessTokenRespnoseOptions = {}): Promise<Record<string, any>> {
    const { data } = await this._axiosClient.post(this.accessTokenRequestUri(), stringify(this.getAccessTokenFields(code, options)))
    return data
  }

  async getAuthUser(accessToken: string): Promise<AuthUser> {
    const { data } = await this.getClient(accessToken).get<{ id: string, username?: string, account_type?: string, media_count?: number }>({
      path: 'me',
      query: {
        fields: [
          'id',
          'username',
          'account_type',
          'media_count',
        ].join(','),
      },
    })
    return {
      id: data.id,
      nickname: data.username,
      raw: data,
    }
  }
}
