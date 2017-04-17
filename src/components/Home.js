import React from 'react';
import PropTypes from 'prop-types';
import SignedInMessage from './SignedInMessage';
import AuthenticationClaims from './AuthenticationClaims';
import UserDetails from './UserDetails';
import Logout from './Logout';
import { Resource } from '@braveulysses/scim2';
import { redirect } from '../util/Helpers';
import { Container } from 'semantic-ui-react';

const Home = props => (
    <Container>
      <SignedInMessage user={props.user} claims={props.claims}/>
      <UserDetails user={props.user} claims={props.claims}/>
      <AuthenticationClaims claims={props.claims}/>
      <Logout redirect={redirect}/>
    </Container>
);

Home.propTypes = {
  user: PropTypes.instanceOf(Resource),
  claims: PropTypes.object
};

export default Home;