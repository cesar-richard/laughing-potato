import React from 'react';
import renderer from 'react-test-renderer';
import { Segment } from 'semantic-ui-react';

describe('Link', () => {
  it('renders correctly', () => {
    const tree = renderer
      .create(<Segment>Segment</Segment>)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
