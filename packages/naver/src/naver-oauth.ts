import { Client, OAuth, OAuth2, AuthUser, AccessTokenResponse } from '@openauth/core'

import { NaverClient } from './naver-client'

interface GetMeResponse {
  resultcode: '00'
  message: 'success'
  response: {
    id: string,
    email: string,
    name: string,
  }
}

export class NaverOAuth extends OAuth2 implements OAuth {

  authRequestUri(): string {
    return 'https://nid.naver.com/oauth2.0/authorize'
  }

  accessTokenRequestUri(): string {
    return 'https://nid.naver.com/oauth2.0/token'
  }

  mapDataToAccessTokenResponse(body: Record<string, any>): AccessTokenResponse {
    return {
      accessToken: body.access_token,
      tokenType: body.token_type,
      expiresIn: +body.expires_in,
      refreshToken: body.refresh_token,
    }
  }

  createClient(accessToken?: string): Client {
    return new NaverClient(this._axiosClient, accessToken)
  }

  async getAuthUser(accessToken: string): Promise<AuthUser> {
    const { data } = await this.getClient(accessToken).get<GetMeResponse>('nid/me')
    return {
      id: data.response.id,
      name: data.response.name,
      email: data.response.email,
      raw: data.response,
    }
  }
}
