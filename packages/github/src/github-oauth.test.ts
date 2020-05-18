import axios from '@openauth/core/node_modules/axios'
import { escape } from 'querystring'

import { GithubOAuth } from './github-oauth'

jest.mock('@openauth/core/node_modules/axios')

describe('testsuite of github oauth', () => {
  const CLIENT_ID = '1234567890'
  const CLIENT_SECRET = '1234567890abcdefghijklmnopqrstuvwxyz'
  const REDIRECT_URI = 'https://wani.kr/auth/github/callback'
  const SCOPE = ['read:user', 'user:email', 'user:follow']

  const oauth = new GithubOAuth({
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    redirectUri: REDIRECT_URI,
    scope: SCOPE,
  })

  it('test getAuthRequestUri', async () => {
    const state = 'randomstring'
    await expect(oauth.getAuthRequestUri({ state })).resolves.toEqual(`https://github.com/login/oauth/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${escape(REDIRECT_URI)}&state=${state}&scope=${escape(SCOPE.join(' '))}`)
  })

  it('test getAccessTokenResponse', async () => {
    (axios.post as any).mockImplementationOnce(() => Promise.resolve({
      data: 'access_token=ACCESSTOKEN_1234567890&expires_in=28800&refresh_token=REFRESHTOKEN_1234567890&refresh_token_expires_in=15897599&scope=&token_type=bearer',
    })).mockClear()

    const AUTHCODE = 'TOKENFROMFACEBOOK_1234567890'
    const state = 'randomstring'
    await expect(oauth.getAccessTokenResponse(AUTHCODE, { state })).resolves.toEqual({
      accessToken: 'ACCESSTOKEN_1234567890',
      expiresIn: 28800,
      refreshToken: 'REFRESHTOKEN_1234567890',
      tokenType: 'bearer',
    })

    expect(axios.post).toHaveBeenCalledTimes(1)
    expect(axios.post).toHaveBeenCalledWith('https://github.com/login/oauth/access_token', `client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&redirect_uri=${escape(REDIRECT_URI)}&code=${AUTHCODE}&state=${state}`)
  })

  it('test getAuthUser', async () => {
    (axios.get as any).mockImplementationOnce(() => Promise.resolve({
      data: {
        id: 123456789,
        avatar_url: 'https://corgi.photos/400/400',
        name: 'Cris Jun',
        email: 'hi@wani.kr',
        bio: 'Computer-Illiterate. JS, a little bit.',
        public_repos: 49,
        public_gists: 18,
        followers: 65,
        following: 103,
        created_at: '2013-04-07T19:53:43Z',
        updated_at: '2020-05-18T14:14:36Z',
      },
    })).mockClear()

    const ACCESS_TOKEN = 'ACCESSTOKEN_1234567890'
    await expect(oauth.getAuthUser(ACCESS_TOKEN)).resolves.toEqual({
      id: '123456789',
      email: 'hi@wani.kr',
      name: 'Cris Jun',
      avatar: 'https://corgi.photos/400/400',
      raw: {
        id: 123456789,
        avatar_url: 'https://corgi.photos/400/400',
        name: 'Cris Jun',
        email: 'hi@wani.kr',
        bio: 'Computer-Illiterate. JS, a little bit.',
        public_repos: 49,
        public_gists: 18,
        followers: 65,
        following: 103,
        created_at: '2013-04-07T19:53:43Z',
        updated_at: '2020-05-18T14:14:36Z',
      },
    })

    expect(axios.get).toHaveBeenCalledTimes(1)
    expect(axios.get).toHaveBeenCalledWith('https://api.github.com/user', {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
      params: {
      },
    })
  })
})
