import React from 'react';
import PropTypes from 'prop-types';
import { Container, Message, Icon } from 'semantic-ui-react';
import HomeButton from './HomeButton';
import { redirect } from '../util/Helpers';

const Error = props => (
    <Container>
      <Message error icon>
        <Icon name="circle warning"/>
        <Message.Content>
          <Message.Header>
            Error
          </Message.Header>
          <p>{props.error}</p>
          <p>{props.errorDetail}</p>
        </Message.Content>
      </Message>
      <HomeButton redirect={redirect}/>
    </Container>
);

Error.propTypes = {
  error: PropTypes.string.isRequired,
  errorDetail: PropTypes.string
};

export default Error;
