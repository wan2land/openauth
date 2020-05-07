
export class OAuthError extends Error {
  constructor(message: string, public code = 'OAUTH_ERROR') {
    super(message)
    this.name = 'OAuthError'
    Object.setPrototypeOf(this, OAuthError.prototype) // typescript bug
  }
}
