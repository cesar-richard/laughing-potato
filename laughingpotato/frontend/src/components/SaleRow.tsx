import React, {lazy} from 'react';

import {Button, Icon, Item} from 'semantic-ui-react';
import {useNavigate} from 'react-router';

const FormattedDate = lazy(() => import('@sparkle/components/FormattedDate'));

export interface SaleRowProps {
  title: string;
  slug: string;
  description: string;
  startDate: string;
  association: {
    shortname: string;
  };
}

const SaleRow = ({
                   title, description, association, startDate, slug,
                 }: SaleRowProps) => {
  const navigate = useNavigate();
  return (
    <Item onClick={() => navigate(`sales/${slug}`)}>
      <Item.Content>
        <Item.Header as="a">{title}</Item.Header>
        <Item.Extra><FormattedDate isoString={startDate} /></Item.Extra>
        <Item.Extra>{association.shortname}</Item.Extra>
        <Item.Description style={{whiteSpace: 'pre-line'}}>
          {description}
        </Item.Description>
        <Item.Extra>
          <Button primary floated="right">
            Acheter
            <Icon name="chevron right" />
          </Button>
        </Item.Extra>
      </Item.Content>
    </Item>
  );
};

export default SaleRow;
