import React, {Suspense} from 'react';
import {Container, Header, Label} from 'semantic-ui-react';
import {Outlet} from 'react-router';
import NavMenu from '@sparkle/components/NavMenu';
import LoaderOverlay from '@sparkle/components/LoaderOverlay';

const Layout = () => (
  <Container>
    <Header textAlign="center">
      <NavMenu />
    </Header>
    <Suspense fallback={<LoaderOverlay />}>
      <Outlet />
    </Suspense>
    <Label color="orange">
      {`Sparkle@${process.env.LAUGHINGPOTATO_VERSION}`}
    </Label>
  </Container>
);

export default Layout;
