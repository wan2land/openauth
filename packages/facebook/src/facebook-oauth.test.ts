import { FacebookOAuth } from './facebook-oauth'
import { escape } from 'querystring'

import axios from '@openauth/core/node_modules/axios'

jest.mock('@openauth/core/node_modules/axios')

describe('testsuite of facebook oauth', () => {
  const CLIENT_ID = '1234567890'
  const CLIENT_SECRET = '1234567890abcdefghijklmnopqrstuvwxyz'
  const REDIRECT_URI = 'https://wani.kr/auth/facebook/callback'
  const SCOPE = ['pages_show_list', 'public_profile']

  const oauth = new FacebookOAuth({
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    redirectUri: REDIRECT_URI,
    scope: SCOPE,
  })

  it('test getAuthRequestUri', async () => {
    await expect(oauth.getAuthRequestUri()).resolves.toEqual(`https://www.facebook.com/v7.0/dialog/oauth?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${escape(REDIRECT_URI)}&scope=${escape(SCOPE.join(','))}`)
  })

  it('test getAccessTokenResponse', async () => {
    (axios.get as any).mockImplementationOnce(() => Promise.resolve({
      data: {
        access_token: 'ACCESSTOKEN_1234567890',
        token_type: 'bearer',
        expires_in: 5183770,
      },
    })).mockClear()

    const AUTHCODE = 'TOKENFROMFACEBOOK_1234567890'
    await expect(oauth.getAccessTokenResponse(AUTHCODE)).resolves.toEqual({
      accessToken: 'ACCESSTOKEN_1234567890',
      tokenType: 'bearer',
      expiresIn: 5183770,
    })

    expect(axios.get).toHaveBeenCalledTimes(1)
    expect(axios.get).toHaveBeenCalledWith(`https://graph.facebook.com/v7.0/oauth/access_token?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&redirect_uri=${escape(REDIRECT_URI)}&code=${AUTHCODE}&grant_type=authorization_code`)
  })

  it('test getAuthUser', async () => {
    (axios.get as any).mockImplementationOnce(() => Promise.resolve({
      data: {
        id: '123456789',
        name: 'Cris Jun',
      },
    })).mockClear()

    const ACCESS_TOKEN = 'ACCESSTOKEN_1234567890'
    await expect(oauth.getAuthUser(ACCESS_TOKEN)).resolves.toEqual({
      id: '123456789',
      name: 'Cris Jun',
      avatar: 'https://graph.facebook.com/v7.0/123456789/picture?type=normal',
      raw: {
        id: '123456789',
        name: 'Cris Jun',
      },
    })

    expect(axios.get).toHaveBeenCalledTimes(1)
    expect(axios.get).toHaveBeenCalledWith('https://graph.facebook.com/v7.0/me', {
      params: {
        access_token: ACCESS_TOKEN,
        fields: 'id,email,name',
      },
      headers: {},
    })
  })
})
