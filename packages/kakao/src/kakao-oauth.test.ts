import axios from '@openauth/core/node_modules/axios'
import { escape } from 'querystring'

import { KakaoOAuth } from './kakao-oauth'


jest.mock('@openauth/core/node_modules/axios')

describe('@openauth/kakao KakaoOAuth', () => {
  const CLIENT_ID = '1234567890'
  const CLIENT_SECRET = '1234567890abcdefghijklmnopqrstuvwxyz'
  const REDIRECT_URI = 'https://wani.kr/auth/kakao/callback'

  const oauth = new KakaoOAuth({
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    redirectUri: REDIRECT_URI,
  })

  it('test getAuthRequestUri', async () => {
    const STATE = 'randomstate'
    await expect(oauth.getAuthRequestUri()).resolves.toEqual(`https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${escape(REDIRECT_URI)}`)
    await expect(oauth.getAuthRequestUri({ state: STATE })).resolves.toEqual(`https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${escape(REDIRECT_URI)}&state=${STATE}`)
  })

  it('test getAccessTokenResponse', async () => {
    (axios.post as any).mockImplementationOnce(() => Promise.resolve({
      data: {
        access_token: 'ACCESSTOKEN_1234567890',
        refresh_token: 'REFRESHTOKEN_1234567890',
        expires_in: 21599,
        token_type: 'bearer',
        refresh_token_expires_in: 5183999,
      },
    })).mockClear()

    const AUTHCODE = 'TOKEN_FROM_KAKAO_1234567890'
    await expect(oauth.getAccessTokenResponse(AUTHCODE)).resolves.toEqual({
      accessToken: 'ACCESSTOKEN_1234567890',
      refreshToken: 'REFRESHTOKEN_1234567890',
      tokenType: 'bearer',
      expiresIn: 21599,
      refreshTokenExpiresIn: 5183999,
    })

    expect(axios.post).toHaveBeenCalledTimes(1)
    expect(axios.post).toHaveBeenCalledWith('https://kauth.kakao.com/oauth/token', `client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&redirect_uri=${escape(REDIRECT_URI)}&code=${AUTHCODE}&grant_type=authorization_code`)
  })

  it('test getAuthUser', async () => {
    (axios.get as any).mockImplementationOnce(() => Promise.resolve({
      data: {
        id: 123456789,
        properties: {
          nickname: 'Cris Jun',
          thumbnail_image: 'https://corgi.photos/100/100',
        },
        kakao_account: {
          email: 'wan2land@gmail.com',
        },
      },
    })).mockClear()

    const ACCESS_TOKEN = 'ACCESSTOKEN_1234567890'
    await expect(oauth.getAuthUser(ACCESS_TOKEN)).resolves.toEqual({
      id: '123456789',
      email: 'wan2land@gmail.com',
      nickname: 'Cris Jun',
      raw: {
        id: 123456789,
        properties: {
          nickname: 'Cris Jun',
          thumbnail_image: 'https://corgi.photos/100/100',
        },
        kakao_account: {
          email: 'wan2land@gmail.com',
        },
      },
    })

    expect(axios.get).toHaveBeenCalledTimes(1)
    expect(axios.get).toHaveBeenCalledWith('https://kapi.kakao.com/v2/user/me', {
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
      params: {},
    })
  })
})
