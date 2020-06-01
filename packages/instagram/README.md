# Open Auth - Instagram

<p align="left">
  <a href="https://npmcharts.com/compare/@openauth/instagram?minimal=true"><img alt="Downloads" src="https://img.shields.io/npm/dt/@openauth/instagram.svg?style=flat-square" /></a>
  <a href="https://www.npmjs.com/package/@openauth/instagram"><img alt="Version" src="https://img.shields.io/npm/v/@openauth/instagram.svg?style=flat-square" /></a>
  <img alt="License" src="https://img.shields.io/npm/l/@openauth/instagram.svg?style=flat-square" />
  <img alt="Typescript" src="https://img.shields.io/badge/language-Typescript-007acc.svg?style=flat-square" />
  <a href="https://david-dm.org/wan2land/openauth?path=packages/instagram"><img alt="dependencies Status" src="https://img.shields.io/david/wan2land/openauth.svg?style=flat-square&path=packages/instagram" /></a>
</p>

**@openauth/instagram** is an implementation of Instagram OAuth.

See [Instagram Basic Display API Document](https://developers.facebook.com/docs/instagram-basic-display-api).

## Installation

```bash
npm i @openauth/instagram
```

## Usage

```typescript
import { InstagramOAuth } from '@openauth/instagram'

const oauth = new InstagramOAuth({
  clientId: 'client_id',
  clientSecret: 'client_secret',
  redirectUri: 'https://wani.kr/auth/instagram/callback',
  scope: [
    'user_profile',
    'user_media',
  ],
})

// 1. After getting auth request uri, connect.
const redirectUri = await oauth.getAuthRequestUri()

// 2. It redirects with the code, and replaces the access token with this code value.
const { accessToken } = await oauth.getAccessTokenResponse(code)

// 3. Get user profile.
await oauth.getAuthUser(accessToken)

// 4. Other API
await oauth.getClient(accessToken).get({
  path: 'me',
  query: {
    fields: [
      'id',
      'username',
      'account_type',
      'media_count',
    ].join(','),
  },
})
```
