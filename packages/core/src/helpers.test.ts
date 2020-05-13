import { assignQuery } from './helpers'

describe('testsuite of helpers', () => {
  it('test assignQuery', () => {
    expect(assignQuery('https://wani.kr/oauth')).toEqual('https://wani.kr/oauth')
    expect(assignQuery('https://wani.kr/oauth?response_type=code')).toEqual('https://wani.kr/oauth?response_type=code')

    expect(assignQuery('https://wani.kr/oauth', { client_id: 'CLIENT_ID' }))
      .toEqual('https://wani.kr/oauth?client_id=CLIENT_ID')

    expect(assignQuery('https://wani.kr/oauth?response_type=code', { client_id: 'CLIENT_ID' }))
      .toEqual('https://wani.kr/oauth?response_type=code&client_id=CLIENT_ID')

    expect(assignQuery('https://wani.kr/oauth?response_type=code', { client_id: 'CLIENT_ID', response_type: 'token' }))
      .toEqual('https://wani.kr/oauth?response_type=token&client_id=CLIENT_ID')

    expect(assignQuery('https://wani.kr/oauth', { client_id: 'CLIENT_ID', response_type: null, ignore_null: null, ignore_undef: undefined }))
      .toEqual('https://wani.kr/oauth?client_id=CLIENT_ID')

    expect(assignQuery('https://wani.kr/oauth?response_type=code', { client_id: 'CLIENT_ID', response_type: null, ignore_null: null, ignore_undef: undefined }))
      .toEqual('https://wani.kr/oauth?client_id=CLIENT_ID')

  })
})
