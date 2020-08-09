import { OAuth, OAuth2, AuthUser, AccessTokenResponse, AccessTokenRespnoseOptions } from '@openauth/core'
import { stringify } from 'querystring'

import { KakaoClient } from './kakao-client'

export class KakaoOAuth extends OAuth2<KakaoClient> implements OAuth {

  authRequestUri(): string {
    return 'https://kauth.kakao.com/oauth/authorize'
  }

  accessTokenRequestUri(): string {
    return 'https://kauth.kakao.com/oauth/token'
  }

  async requestAccessToken(code: string, options: AccessTokenRespnoseOptions = {}): Promise<Record<string, any>> {
    const { data } = await this._axiosClient.post(this.accessTokenRequestUri(), stringify(this.getAccessTokenFields(code, options)))
    return data
  }

  mapDataToAccessTokenResponse(body: Record<string, any>): AccessTokenResponse {
    return {
      accessToken: body.access_token,
      tokenType: body.token_type,
      expiresIn: body.expires_in,
      refreshToken: body.refresh_token,
      refreshTokenExpiresIn: body.refresh_token_expires_in,
    }
  }

  createClient(accessToken?: string): KakaoClient {
    return new KakaoClient(this._axiosClient, accessToken)
  }

  async getAuthUser(accessToken: string): Promise<AuthUser> {
    const { data } = await this.getClient(accessToken).getUserMe()
    return {
      id: `${data.id}`,
      email: data.kakao_account?.email,
      nickname: data.properties?.nickname ?? data.kakao_account?.profile?.nickname,
      avatar: data.properties?.profile_image ?? data.kakao_account?.profile?.profile_image_url,
      raw: data,
    }
  }
}
