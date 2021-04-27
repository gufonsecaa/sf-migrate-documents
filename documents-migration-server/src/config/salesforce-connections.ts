const origin = {
  oauth2: {
    loginUrl: 'https://login.salesforce.com',
    redirectUri: 'http://localhost:3000/oauth/_callback',
    clientId: process.env.SF_ORIGIN_CLIENT_ID,
    clientSecret: process.env.SF_ORIGIN_CLIENT_SECRET
  },
  userInfo: {
    username: process.env.SF_ORIGIN_USERNAME,
    password: process.env.SF_ORIGIN_PASSWORD,
    securityToken: process.env.SF_ORIGIN_SECURITY_TOKEN,
  }
}

const target = {
  oauth2: {
    loginUrl: 'https://test.salesforce.com',
    redirectUri: 'http://localhost:3000/oauth/_callback',
    clientId: process.env.SF_TARGET_CLIENT_ID,
    clientSecret: process.env.SF_TARGET_CLIENT_SECRET
  },
  userInfo: {
    username: process.env.SF_TARGET_USERNAME,
    password: process.env.SF_TARGET_PASSWORD,
    securityToken: process.env.SF_TARGET_SECURITY_TOKEN
  }
}

export { origin, target }
