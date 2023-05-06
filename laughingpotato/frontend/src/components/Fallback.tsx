import React from 'react';

import {Dimmer, Loader} from 'semantic-ui-react';

const Fallback = () => (
  <Dimmer active>
    <Loader indeterminate>Loading Sparkle ✨</Loader>
  </Dimmer>
);

export default Fallback;
