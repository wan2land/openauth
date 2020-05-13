import { BaseClient, ClientPath } from '@openauth/core'

export class GoogleClient extends BaseClient {

  request<TData = any>(method: string, path: ClientPath, params: Record<string, any> = {}, headers: Record<string, any> = {}): Promise<{ headers: any, data: TData }> {
    const url = `https://www.googleapis.com//${(typeof path === 'object' ? path.path : path).replace(/^\/+/, '')}`
    const query = typeof path === 'object' ? path.query : {}
    if (method.toLocaleLowerCase() === 'get') {
      return this._axios.get(url, {
        params: query,
        headers: {
          Accept: 'application/json',
          ...this.accessToken ? { Authorization: `Bearer ${this.accessToken}` } : {},
          ...headers,
        },
      })
    }
    return this._axios.request({
      method: method as any,
      url,
      params: query,
      headers: {
        Accept: 'application/json',
        ...this.accessToken ? { Authorization: `Bearer ${this.accessToken}` } : {},
        ...headers,
      },
      data: params,
    })
  }
}
