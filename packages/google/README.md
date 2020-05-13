# Open Auth - Google

<p align="left">
  <a href="https://npmcharts.com/compare/@openauth/google?minimal=true"><img alt="Downloads" src="https://img.shields.io/npm/dt/@openauth/google.svg?style=flat-square" /></a>
  <a href="https://www.npmjs.com/package/@openauth/google"><img alt="Version" src="https://img.shields.io/npm/v/@openauth/google.svg?style=flat-square" /></a>
  <img alt="License" src="https://img.shields.io/npm/l/@openauth/google.svg?style=flat-square" />
  <img alt="Typescript" src="https://img.shields.io/badge/language-Typescript-007acc.svg?style=flat-square" />
  <a href="https://david-dm.org/wan2land/openauth?path=packages/@openauth/google"><img alt="dependencies Status" src="https://img.shields.io/david/wan2land/openauth.svg?style=flat-square&path=packages/@openauth/google" /></a>
</p>

**@openauth/google** is an implementation of Google OAuth.

## Installation

```bash
npm i @openauth/google
```

## Usage

```typescript
import { GoogleOAuth } from '@openauth/google'

const oauth = new GoogleOAuth({
  clientId: 'client_id',
  clientSecret: 'client_secret',
  redirectUri: 'https://wani.kr/auth/google/callback',
  scope: [
    'public_profile',
  ],
})
```
