# broker-react-sign-in-sample [![Build Status](https://travis-ci.org/UnboundID/broker-react-sign-in-sample.svg?branch=master)](https://travis-ci.org/UnboundID/broker-react-sign-in-sample)

![React Sign In Sample animation](https://cloud.githubusercontent.com/assets/50972/21905894/af6b073a-d8ce-11e6-9a4a-a8eb520f9ecb.gif)

This sample demonstrates how a client-side web application written with 
[React](https://facebook.github.io/react/) can use the Data Governance 
Broker as an authentication and authorization server using OAuth 2 and 
OpenID Connect. It shows how an application may:

* Make an OAuth 2/OpenID Connect request
* Handle an OAuth 2/OpenID Connect redirect response
* Verify a JWT ID token signature
* Validate ID token claims
* Perform logout to revoke an access token
* Read JSON Web Keys from a JWKS endpoint
* Retrieve user profile data from a SCIM endpoint
* Retrieve user profile data from ID token claims

## Prerequisites

[NodeJS](https://docs.npmjs.com/getting-started/installing-node) and 
[Yarn](https://yarnpkg.com/en/docs/install) 
must be installed. 

The Data Governance Broker must be version 6.0.0.0 and above, and the 
"user and reference app" [starter schema](https://developer.unboundid.com/6.0.0.1/broker/guides/broker-client-developer-guide/basics/schema/#The-starter-schema)
should have been installed. If you have installed a custom schema, then 
you may need to modify the attribute mappings in `src/Config.js`.

## How to run

Clone this repository:

```
git clone https://github.com/UnboundID/broker-react-sign-in-sample.git
```

Install the application's dependencies:

```
cd broker-react-sign-in-sample
yarn
```

Update the Broker's configuration to register the application:

```
dsconfig --no-prompt --batch-file setup.dsconfig
```

Edit the `src/Config.js` file. You'll need to set the `issuer` setting 
to match the issuer URL of the Broker's authentication service:

```javascript
export const OIDC = {
  // The auth server's issuer ID.
  issuer: 'https://example.com',
  // The JWT signing algorithm.
  jwa: 'RS256',
  // The JWK that contains the JWT's public signing key.
  jwkId: 'sample-idtoken-key',
  // A grace period in seconds for verifying time-based claims
  // (e.g., 'iat', 'exp').
  gracePeriod: 15
};
```

And you'll need to set the service URLs for yourBroker installation:

```javascript
// Data Governance Broker service URLs.
export const BROKER = {
  authorizeEndpoint: 'https://example.com/oauth/authorize',
  logoutEndpoint: 'https://example.com/oauth/logout',
  jwksEndpoint: 'https://example.com/jwks',
  meEndpoint: 'https://example.com/scim/v2/Me'
};
```

Finally, start the broker-react-sign-in-sample:

```
yarn start
```

This will automatically open the application in a browser window. 
By default, it runs from a local HTTP server at `http://localhost:3000`.

## Notes

* By default, the application listens on an unsecured HTTP port. Please be
aware that a production web application should always be served using HTTPS.
* The application does not support encrypted ID tokens.
* You can use npm if you don't want to use Yarn.

## Support and reporting bugs

This sample is not officially supported, but support will be provided
on a best-effort basis through GitHub. Please be aware that this sample is
provided for demonstration purposes and is not intended to be production-ready.

Please report issues using the project's
[issue tracker](https://github.com/UnboundID/broker-react-sign-in-sample/issues).

## License

This is licensed under the Apache License 2.0.