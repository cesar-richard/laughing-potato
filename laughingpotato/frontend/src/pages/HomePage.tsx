import React, {lazy, useContext} from 'react';
import SessionContext from '@sparkle/utils/SessionContext';
import {Segment} from 'semantic-ui-react';

const SalesList = lazy(() => import('@sparkle/components/SalesList'));

const HomePage = () => {
  const {user} = useContext(SessionContext);

  return <Segment>{user !== null ? <SalesList /> : 'Vous devez vous connecter avant de pouvoir continuer.'}</Segment>;
};

export default HomePage;
