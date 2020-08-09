import { NaverOAuth } from './naver-oauth'
import { escape } from 'querystring'

import axios from '@openauth/core/node_modules/axios'

jest.mock('@openauth/core/node_modules/axios')

describe('testsuite of naver oauth', () => {
  const CLIENT_ID = '1234567890'
  const CLIENT_SECRET = '1234567890abcdefghijklmnopqrstuvwxyz'
  const REDIRECT_URI = 'https://wani.kr/auth/naver/callback'

  const oauth = new NaverOAuth({
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    redirectUri: REDIRECT_URI,
  })

  it('test getAuthRequestUri', async () => {
    const STATE = 'randomstate'
    await expect(oauth.getAuthRequestUri()).resolves.toEqual(`https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${escape(REDIRECT_URI)}`)
    await expect(oauth.getAuthRequestUri({ state: STATE })).resolves.toEqual(`https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${escape(REDIRECT_URI)}&state=${STATE}`)
  })

  it('test getAccessTokenResponse', async () => {
    (axios.get as any).mockImplementationOnce(() => Promise.resolve({
      data: {
        access_token: 'ACCESSTOKEN_1234567890',
        refresh_token: 'REFRESHTOKEN_1234567890',
        expires_in: '3600',
        token_type: 'bearer',
      },
    })).mockClear()

    const AUTHCODE = 'TOKENFROMNAVER_1234567890'
    await expect(oauth.getAccessTokenResponse(AUTHCODE)).resolves.toEqual({
      accessToken: 'ACCESSTOKEN_1234567890',
      refreshToken: 'REFRESHTOKEN_1234567890',
      tokenType: 'bearer',
      expiresIn: 3600,
    })

    expect(axios.get).toHaveBeenCalledTimes(1)
    expect(axios.get).toHaveBeenCalledWith(`https://nid.naver.com/oauth2.0/token?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&redirect_uri=${escape(REDIRECT_URI)}&code=${AUTHCODE}&grant_type=authorization_code`)
  })

  it('test getAuthUser', async () => {
    (axios.get as any).mockImplementationOnce(() => Promise.resolve({
      data: {
        resultcode: '00',
        message: 'success',
        response: {
          id: '123456789',
          email: 'wan2land@gmail.com',
          name: 'Cris Jun',
        },
      },
    })).mockClear()

    const ACCESS_TOKEN = 'ACCESSTOKEN_1234567890'
    await expect(oauth.getAuthUser(ACCESS_TOKEN)).resolves.toEqual({
      id: '123456789',
      email: 'wan2land@gmail.com',
      name: 'Cris Jun',
      raw: {
        id: '123456789',
        email: 'wan2land@gmail.com',
        name: 'Cris Jun',
      },
    })

    expect(axios.get).toHaveBeenCalledTimes(1)
    expect(axios.get).toHaveBeenCalledWith('https://openapi.naver.com/v1/nid/me', {
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
      params: {},
    })
  })
})
