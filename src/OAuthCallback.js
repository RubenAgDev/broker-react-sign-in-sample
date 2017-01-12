import React, { Component } from 'react';
import { Container } from 'semantic-ui-react';
import ReactRedirect from 'react-redirect';
import { parseParamsFromUrl, getJwks } from './util/Helpers';
import Storage from './util/Storage';
import JwsVerifier from './util/JwsVerifier';
import { OAUTH_CLIENT, OIDC } from './Config';
import LayoutContainer from './containers/LayoutContainer';
import Loading from './components/Loading';
import Error from './components/Error';
import './App.css';

class OAuthCallback extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ready: false,
      loadingMessage: 'Loading'
    };
    this.checkState = this.checkState.bind(this);
    this.handleAccessToken = this.handleAccessToken.bind(this);
    this.handleIdToken = this.handleIdToken.bind(this);
    this.storeClaims = this.storeClaims.bind(this);
    this.clearStorage = this.clearStorage.bind(this);
    this.handleCallback = this.handleCallback.bind(this);
  }

  checkState(expectedState, actualState) {
    console.log('Confirming state received from auth server matches');
    if (expectedState !== actualState) {
      console.warn('State mismatch');
      this.setState({
        error: 'Expected state value not received from auth server.'
      });
    }
  }

  handleAccessToken(accessToken, idToken) {
    console.log('Storing access token', idToken);
    let storage = new Storage();
    storage.setConfig('accessToken', accessToken);
    if (!idToken) {
      this.setState({
        ready: true
      });
    }
  }

  handleIdToken(idToken, expectedNonce) {
    console.log('Validating ID token', idToken);
    this.setState({
      loadingMessage: 'Validating ID token'
    });
    console.log('Retrieving JWKS');
    getJwks().then(response => {
      return response.json();
    }).then(jwks => {
      const jwk = jwks.keys.find((jwk) => {
        return jwk.kid && jwk.kid === OIDC.jwkId;
      });

      const expectedClaims = {
        alg: [ OIDC.jwa ],
        iss: OIDC.issuer,
        aud: OAUTH_CLIENT.clientId,
        nonce: expectedNonce,
        gracePeriod: OIDC.gracePeriod
      };

      try {
        const claims = JwsVerifier.verify(idToken, jwk, expectedClaims);
        console.log('Validated ID token');
        this.storeClaims(claims);
        this.setState({
          ready: true
        });
      } catch (e) {
        console.warn('ID token is invalid', e);
        this.setState({
          error: 'ID token validation failed.'
        });
        this.clearStorage(['state', 'nonce']);
      }
    });
  }

  storeClaims(claims) {
    let storage = new Storage();
    storage.setConfig('claims', JSON.stringify(claims));
  }

  clearStorage(keys) {
    let storage = new Storage();
    keys.forEach((key) => {
      storage.deleteConfig(key);
    });
  }

  handleCallback(url) {
    let params = parseParamsFromUrl(url);
    let storage = new Storage();

    if (params['state']) {
      this.checkState(storage.getConfig('state'), params['state']);
    }

    if (params['access_token'] || params['id_token']) {
      if (params['access_token']) {
        this.handleAccessToken(params['access_token'], params['id_token']);
      }
      if (params['id_token']) {
        this.handleIdToken(params['id_token'], storage.getConfig('nonce'));
      }
    } else {
      if (params['error']) {
        this.setState({
          error: params['error']
        });
      }

      if (params['error_description']) {
        this.setState({
          errorDetail: params['error_description']
        });
      }

      // If we make it this far, then this must be a logout response.
      this.setState({
        ready: true
      });
    }
  }

  componentWillMount() {
    this.handleCallback(this.props.url);
  }

  render() {
    if (this.state.error) {
      return (
          <Container className="App">
            <LayoutContainer>
              <Error
                  error={this.state.error}
                  errorDetail={this.state.errorDetail}
              />
            </LayoutContainer>
          </Container>
      );
    }
    if (this.state.ready) {
      return (
          <ReactRedirect location="/"/>
      );
    }
    return (
        <Loading message={this.state.loadingMessage}/>
    );
  }
}

OAuthCallback.defaultProps = {
  url: window.location.href
};

export default OAuthCallback;
