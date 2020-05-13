import { GoogleOAuth } from './google-oauth'
import { escape } from 'querystring'

import axios from '@openauth/core/node_modules/axios'

jest.mock('@openauth/core/node_modules/axios')

describe('testsuite of google oauth', () => {
  const CLIENT_ID = '1234567890'
  const CLIENT_SECRET = '1234567890abcdefghijklmnopqrstuvwxyz'
  const REDIRECT_URI = 'https://wani.kr/auth/google/callback'
  const SCOPE = ['openid', 'profile', 'email']

  const oauth = new GoogleOAuth({
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    redirectUri: REDIRECT_URI,
    scope: SCOPE,
  })

  it('test getAuthRequestUri', async () => {
    await expect(oauth.getAuthRequestUri()).resolves.toEqual(`https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${escape(REDIRECT_URI)}&scope=${escape(SCOPE.join(' '))}`)
  })

  it('test getAccessTokenResponse', async () => {
    (axios.post as any).mockImplementationOnce(() => Promise.resolve({
      data: {
        access_token: 'ACCESSTOKEN_1234567890',
        expires_in: 3599,
        scope: 'openid https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
        token_type: 'Bearer',
        id_token: 'IDTOKEN_1234567890',
      },
    })).mockClear()

    const AUTHCODE = 'TOKENFROMFACEBOOK_1234567890'
    await expect(oauth.getAccessTokenResponse(AUTHCODE)).resolves.toEqual({
      accessToken: 'ACCESSTOKEN_1234567890',
      tokenType: 'Bearer',
      expiresIn: 3599,
    })

    expect(axios.post).toHaveBeenCalledTimes(1)
    expect(axios.post).toHaveBeenCalledWith('https://oauth2.googleapis.com/token', `client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&redirect_uri=${escape(REDIRECT_URI)}&code=${AUTHCODE}&grant_type=authorization_code`)
  })

  it('test getAuthUser', async () => {
    (axios.get as any).mockImplementationOnce(() => Promise.resolve({
      data: {
        email: 'wan2land@gmail.com',
        email_verified: true,
        family_name: 'Jun',
        given_name: 'Cris',
        locale: 'ko',
        name: 'Cris Jun',
        picture: 'https://corgi.photos/200/200',
        sub: '123456789',
      },
    })).mockClear()

    const ACCESS_TOKEN = 'ya29.a0AfH6SMCl9aeMTv30g4VYkJblkKidgvL3QCO0sbFQzXzeeNbrALFZr5ixY5HX2j-Cl1OZny-h-E_Bu4fqkwEBnc4WCTZYNjxRE8Fibuqk2SN5NegLlM6Sp2ZIdecWpKMhaBmvbE-a6rFzVCu10PlZ-acRS2gJGPxOFx0' // 'ACCESSTOKEN_1234567890'
    await expect(oauth.getAuthUser(ACCESS_TOKEN)).resolves.toEqual({
      id: '123456789',
      email: 'wan2land@gmail.com',
      name: 'Cris Jun',
      avatar: 'https://corgi.photos/200/200',
      raw: {
        email: 'wan2land@gmail.com',
        email_verified: true,
        family_name: 'Jun',
        given_name: 'Cris',
        locale: 'ko',
        name: 'Cris Jun',
        picture: 'https://corgi.photos/200/200',
        sub: '123456789',
      },
    })

    expect(axios.get).toHaveBeenCalledTimes(1)
    expect(axios.get).toHaveBeenCalledWith('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
      params: {},
    })
  })
})
