import { AuthUser, OAuth } from '@openauth/core'
import { GoogleOAuth } from '@openauth/google'

export interface YoutubeOAuthOptions {
  clientId: string
  clientSecret: string
  redirectUri: string
  code?: string
}

export class YoutubeOAuth extends GoogleOAuth implements OAuth {

  constructor(options: YoutubeOAuthOptions) {
    super({
      ...options,
      scope: ['https://www.googleapis.com/auth/youtube.readonly'],
    })
  }

  async getAuthUser(accessToken: string): Promise<AuthUser> {
    const { data } = await this.getClient(accessToken).get<{
      kind: string,
      etag: string,
      pageInfo: {
        totalResults: number,
        resultsPerPage: number,
      },
      items: {
        kind: string,
        etag: string,
        id: string,
        snippet: {
          title: string,
          description: string,
          publishedAt: string,
          thumbnails: {
            default: {
              url: string,
              width: number,
              height: number,
            },
            medium: {
              url: string,
              width: number,
              height: number,
            },
            high: {
              url: string,
              width: number,
              height: number,
            },
          },
          localized: {
            title: string,
            description: string,
          },
        },
      }[],
    }>({
      path: 'youtube/v3/channels',
      query: {
        part: 'snippet',
        mine: 'true',
      },
    })
    return {
      id: data.items[0].id,
      nickname: data.items[0].snippet.title,
      avatar: data.items[0].snippet.thumbnails.high.url,
      raw: data.items[0],
    }
  }
}
