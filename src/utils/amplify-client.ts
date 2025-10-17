'use client';
import { Amplify } from 'aws-amplify';

Amplify.configure(
  {
    Auth: {
      Cognito: {
        userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID!,
        userPoolClientId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID!,
        loginWith: {
          oauth: {
            domain: process.env.NEXT_PUBLIC_COGNITO_DOMAIN!,
            scopes: ['openid', 'email'],
            redirectSignIn: [process.env.NEXT_PUBLIC_OAUTH_REDIRECT_IN!],
            redirectSignOut: [process.env.NEXT_PUBLIC_OAUTH_REDIRECT_OUT!],
            responseType: 'code',
          },
        },
      },
    },
  },
  { ssr: false }
);
