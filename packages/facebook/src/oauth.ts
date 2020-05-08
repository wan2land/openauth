import { AuthUser, BaseOAuth, OAuth } from '@openauth/core'

export interface FacebookOAuthOptions {
  version?: string
  clientId: string
  redirectUri: string
  clientSecret: string
  scope: string | string[]
}

export class FacebookOAuth extends BaseOAuth implements OAuth {

  version: string

  constructor(options: FacebookOAuthOptions) {
    super(options)
    this.version = options.version ?? 'v7.0'
  }

  authRequestUri(): string {
    return `https://www.facebook.com/${this.version}/dialog/oauth`
  }

  accessTokenRequestUri(): string {
    return `https://graph.facebook.com/${this.version}/oauth/access_token`
  }

  apiRequestUri(path: string): string {
    return `https://graph.facebook.com/${this.version}${path}`
  }

  authUserPath(): string {
    return '/me'
  }

  async getAuthUser(accessToken: string): Promise<AuthUser> {
    return this.buildAuthUserResponse(await this.authGet(accessToken, this.authUserPath(), {
      fields: 'id,email,name',
    }))
  }
}
