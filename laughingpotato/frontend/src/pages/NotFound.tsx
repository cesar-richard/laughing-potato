import React from 'react';
import {Header, Segment} from 'semantic-ui-react';
import {Link} from 'react-router-dom';

const NotFound = () => (
  <Segment>
    <Header as="h1">Page not found</Header>

    <Link to="/">Go to the home page</Link>

  </Segment>
);

export default NotFound;
