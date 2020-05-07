/* eslint-disable @typescript-eslint/camelcase */
import { camelToUnderscore, createUri, underscoreToCamel } from './helpers'

describe('testsuite of helpers', () => {
  it('test underscoreToCamel', () => {
    expect(underscoreToCamel({ access_token: 'aaa', refresh_token: 'bbb' })).toEqual({ accessToken: 'aaa', refreshToken: 'bbb' })
    expect(underscoreToCamel({ accessToken: 'aaa', refreshToken: 'bbb' })).toEqual({ accessToken: 'aaa', refreshToken: 'bbb' })
  })

  it('test camelToUnderscore', () => {
    expect(camelToUnderscore({ access_token: 'aaa', refresh_token: 'bbb' })).toEqual({ access_token: 'aaa', refresh_token: 'bbb' })
    expect(camelToUnderscore({ accessToken: 'aaa', refreshToken: 'bbb' })).toEqual({ access_token: 'aaa', refresh_token: 'bbb' })
  })

  it('test createUri', () => {
    expect(createUri('https://wani.kr/oauth')).toEqual('https://wani.kr/oauth')
    expect(createUri('https://wani.kr/oauth?response_type=code')).toEqual('https://wani.kr/oauth?response_type=code')

    expect(createUri('https://wani.kr/oauth', { clientId: 'CLIENT_ID' }))
      .toEqual('https://wani.kr/oauth?client_id=CLIENT_ID')

    expect(createUri('https://wani.kr/oauth?response_type=code', { clientId: 'CLIENT_ID' }))
      .toEqual('https://wani.kr/oauth?response_type=code&client_id=CLIENT_ID')

    expect(createUri('https://wani.kr/oauth?response_type=code', { clientId: 'CLIENT_ID', responseType: 'token' }))
      .toEqual('https://wani.kr/oauth?response_type=token&client_id=CLIENT_ID')
  })
})
