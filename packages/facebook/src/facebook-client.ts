import { AxiosInstance, BaseClient, ClientPath } from '@openauth/core'
import { stringify } from 'querystring'

export class FacebookClient extends BaseClient {

  constructor(_axios: AxiosInstance, public version: string, accessToken?: string | undefined) {
    super(_axios, accessToken)
  }

  request<TData = any>(method: string, path: ClientPath, params: Record<string, any> = {}, headers: Record<string, any> = {}): Promise<{ headers: any, data: TData }> {
    const url = `https://graph.facebook.com/${this.version}/${(typeof path === 'object' ? path.path : path).replace(/^\/+/, '')}`
    const query = typeof path === 'object' ? path.query : {}
    if (method.toLocaleLowerCase() === 'get') {
      return this._axios.get(url, {
        params: {
          ...this.accessToken ? { access_token: this.accessToken } : {},
          ...query,
        },
        headers,
      })
    }
    return this._axios.request({
      method: method as any,
      url,
      params: query,
      headers,
      data: stringify({
        ...this.accessToken ? { access_token: this.accessToken } : {},
        ...params,
      }),
    })
  }
}
