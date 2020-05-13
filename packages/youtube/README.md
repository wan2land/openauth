# Open Auth - Youtube

<p align="left">
  <a href="https://npmcharts.com/compare/@openauth/youtube?minimal=true"><img alt="Downloads" src="https://img.shields.io/npm/dt/@openauth/youtube.svg?style=flat-square" /></a>
  <a href="https://www.npmjs.com/package/@openauth/youtube"><img alt="Version" src="https://img.shields.io/npm/v/@openauth/youtube.svg?style=flat-square" /></a>
  <img alt="License" src="https://img.shields.io/npm/l/@openauth/youtube.svg?style=flat-square" />
  <img alt="Typescript" src="https://img.shields.io/badge/language-Typescript-007acc.svg?style=flat-square" />
  <a href="https://david-dm.org/wan2land/openauth?path=packages/youtube"><img alt="dependencies Status" src="https://img.shields.io/david/wan2land/openauth.svg?style=flat-square&path=packages/youtube" /></a>
</p>

**@openauth/youtube** is an implementation of Youtube OAuth.

## Installation

```bash
npm i @openauth/youtube
```

## Usage

```typescript
import { YoutubeOAuth } from '@openauth/youtube'

const oauth = new YoutubeOAuth({
  clientId: 'client_id',
  clientSecret: 'client_secret',
  redirectUri: 'https://wani.kr/auth/youtube/callback',
  scope: [
    'public_profile',
  ],
})
```
