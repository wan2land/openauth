import { AxiosInstance } from 'axios'

import { Client, ClientPath } from './interfaces/oauth'


export class BaseClient implements Client {
  constructor(public _axios: AxiosInstance, public accessToken?: string) {
  }

  get<TData = any>(path: ClientPath, params: Record<string, any> = {}, headers: Record<string, string | string[]> = {}): Promise<{ headers: any, data: TData }> {
    return this.request<TData>('GET', path, params, headers)
  }

  post<TData = any>(path: ClientPath, params: Record<string, any> = {}, headers: Record<string, string | string[]> = {}): Promise<{ headers: any, data: TData }> {
    return this.request<TData>('POST', path, params, headers)
  }

  put<TData = any>(path: ClientPath, params: Record<string, any> = {}, headers: Record<string, string | string[]> = {}): Promise<{ headers: any, data: TData }> {
    return this.request<TData>('PUT', path, params, headers)
  }

  delete<TData = any>(path: ClientPath, params: Record<string, any> = {}, headers: Record<string, string | string[]> = {}): Promise<{ headers: any, data: TData }> {
    return this.request<TData>('DELETE', path, params, headers)
  }

  request<TData = any>(method: string, path: ClientPath, params: Record<string, any> = {}, headers: Record<string, any> = {}): Promise<{ headers: any, data: TData }> {
    throw new TypeError('It must be implemented.')
  }
}
