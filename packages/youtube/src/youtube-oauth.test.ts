import { YoutubeOAuth } from './youtube-oauth'
import { escape } from 'querystring'

import axios from '@openauth/core/node_modules/axios'

jest.mock('@openauth/core/node_modules/axios')

describe('@openauth/youtube YoutubeOAuth', () => {
  const CLIENT_ID = '1234567890'
  const CLIENT_SECRET = '1234567890abcdefghijklmnopqrstuvwxyz'
  const REDIRECT_URI = 'https://wani.kr/auth/youtube/callback'

  const oauth = new YoutubeOAuth({
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    redirectUri: REDIRECT_URI,
  })

  it('test getAuthRequestUri', async () => {
    await expect(oauth.getAuthRequestUri()).resolves.toEqual(`https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${escape(REDIRECT_URI)}&scope=${escape('https://www.googleapis.com/auth/youtube.readonly')}`)
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

    const AUTHCODE = 'TOKEN_FROM_YOUTUBE_1234567890'
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
        kind: 'youtube#channelListResponse',
        etag: 'ETAG_12345',
        pageInfo: {
          totalResults: 1,
          resultsPerPage: 1,
        },
        items: [
          {
            kind: 'youtube#channel',
            etag: 'ETAG_12345',
            id: 'abcdefg',
            snippet: {
              title: 'Wani.kr',
              description: '',
              publishedAt: '2020-01-01T00:00:00Z',
              thumbnails: {
                default: {
                  url: 'https://corgi.photos/88/88',
                  width: 88,
                  height: 88,
                },
                medium: {
                  url: 'https://corgi.photos/240/240',
                  width: 240,
                  height: 240,
                },
                high: {
                  url: 'https://corgi.photos/800/800',
                  width: 800,
                  height: 800,
                },
              },
              localized: {
                title: 'Wani.kr',
                description: '',
              },
            },
          },
        ],
      },
    })).mockClear()

    const ACCESS_TOKEN = 'ya29.a0AfH6SMCl9aeMTv30g4VYkJblkKidgvL3QCO0sbFQzXzeeNbrALFZr5ixY5HX2j-Cl1OZny-h-E_Bu4fqkwEBnc4WCTZYNjxRE8Fibuqk2SN5NegLlM6Sp2ZIdecWpKMhaBmvbE-a6rFzVCu10PlZ-acRS2gJGPxOFx0' // 'ACCESSTOKEN_1234567890'
    await expect(oauth.getAuthUser(ACCESS_TOKEN)).resolves.toEqual({
      id: 'abcdefg',
      nickname: 'Wani.kr',
      avatar: 'https://corgi.photos/800/800',
      raw: {
        kind: 'youtube#channel',
        etag: 'ETAG_12345',
        id: 'abcdefg',
        snippet: {
          title: 'Wani.kr',
          description: '',
          publishedAt: '2020-01-01T00:00:00Z',
          thumbnails: {
            default: {
              url: 'https://corgi.photos/88/88',
              width: 88,
              height: 88,
            },
            medium: {
              url: 'https://corgi.photos/240/240',
              width: 240,
              height: 240,
            },
            high: {
              url: 'https://corgi.photos/800/800',
              width: 800,
              height: 800,
            },
          },
          localized: {
            title: 'Wani.kr',
            description: '',
          },
        },
      },
    })

    expect(axios.get).toHaveBeenCalledTimes(1)
    expect(axios.get).toHaveBeenCalledWith('https://www.googleapis.com/youtube/v3/channels', {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
      params: {
        mine: 'true',
        part: 'snippet',
      },
    })
  })
})
