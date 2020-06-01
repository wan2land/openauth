import { InstagramOAuth } from './instagram-oauth'
import { escape } from 'querystring'

import axios from '@openauth/core/node_modules/axios'

jest.mock('@openauth/core/node_modules/axios')

describe('testsuite of instagram oauth', () => {
  const CLIENT_ID = '908977962871164' // '1234567890'
  const CLIENT_SECRET = '1234567890abcdefghijklmnopqrstuvwxyz'
  const REDIRECT_URI = 'https://wani.kr/auth/instagram/callback'
  const SCOPE = [
    'user_profile',
    'user_media',
  ]

  const oauth = new InstagramOAuth({
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    redirectUri: REDIRECT_URI,
    scope: SCOPE,
  })

  it('test getAuthRequestUri', async () => {
    await expect(oauth.getAuthRequestUri()).resolves.toEqual(`https://api.instagram.com/oauth/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${escape(REDIRECT_URI)}&scope=${escape(SCOPE.join(','))}`)
  })

  it('test getAccessTokenResponse', async () => {
    (axios.post as any).mockImplementationOnce(() => Promise.resolve({
      data: {
        access_token: 'ACCESSTOKEN_1234567890',
        user_id: 123456789,
      },
    })).mockClear()

    const AUTHCODE = 'TOKENFROMINSTAGRAM_1234567890'
    await expect(oauth.getAccessTokenResponse(AUTHCODE)).resolves.toEqual({
      accessToken: 'ACCESSTOKEN_1234567890',
    })

    expect(axios.post).toHaveBeenCalledTimes(1)
    expect(axios.post).toHaveBeenCalledWith('https://api.instagram.com/oauth/access_token', `client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&redirect_uri=${escape(REDIRECT_URI)}&code=${AUTHCODE}&grant_type=authorization_code`)
  })

  it('test getAuthUser', async () => {
    (axios.get as any).mockImplementationOnce(() => Promise.resolve({
      data: {
        id: '123456790',
        username: 'crisjun',
        account_type: 'BUSINESS',
        media_count: 100,
      },
    })).mockClear()

    const ACCESS_TOKEN = 'ACCESSTOKEN_1234567890'
    await expect(oauth.getAuthUser(ACCESS_TOKEN)).resolves.toEqual({
      id: '123456790',
      nickname: 'crisjun',
      raw: {
        id: '123456790',
        username: 'crisjun',
        account_type: 'BUSINESS',
        media_count: 100,
      },
    })

    expect(axios.get).toHaveBeenCalledTimes(1)
    expect(axios.get).toHaveBeenCalledWith('https://graph.instagram.com/me', {
      params: {
        access_token: ACCESS_TOKEN,
        fields: 'id,username,account_type,media_count',
      },
      headers: {},
    })
  })
})
