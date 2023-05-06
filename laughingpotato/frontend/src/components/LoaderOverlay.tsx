import React from 'react';
import PropTypes from 'prop-types';
import {Dimmer, Loader, Placeholder, Segment,} from 'semantic-ui-react';

export interface Props {
  content?: React.ReactNode,
}

const LoaderOverlay = ({content}: Props) => (
  <Segment>
    <Dimmer active>
      <Loader indeterminate>{content}</Loader>
    </Dimmer>
    <Placeholder>
      <Placeholder.Header image>
        <Placeholder.Line />
        <Placeholder.Line />
      </Placeholder.Header>
      <Placeholder.Paragraph>
        <Placeholder.Line />
        <Placeholder.Line />
        <Placeholder.Line />
        <Placeholder.Line />
      </Placeholder.Paragraph>
    </Placeholder>
  </Segment>
);

LoaderOverlay.defaultProps = {
  content: 'Loading...',
};

LoaderOverlay.propTypes = {
  content: PropTypes.string,
};

export default LoaderOverlay;
