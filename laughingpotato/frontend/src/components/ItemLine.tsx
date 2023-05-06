import {Card, Icon, Popup} from 'semantic-ui-react';
import React, {lazy} from 'react';
import SessionContext from '@sparkle/utils/SessionContext';

const NumberInput = lazy(() => import('@sparkle/components/NumberInput'));

export interface ItemLineProps {
  description: string;
  id: number;
  maxQuantityPerOrder: number;
  minQuantityPerOrder: number;
  membersOnly: boolean;
  price: string;
  name: string;
  disabled: boolean;
  onChange: (newValue: {
    item: number;
    quantity: number;
  }) => void;
}

const ItemLine = ({
                    description,
                    id,
                    maxQuantityPerOrder,
                    minQuantityPerOrder,
                    membersOnly,
                    name,
                    price,
                    disabled,
                    onChange,
                  }: ItemLineProps) => {
  const {user} = React.useContext(SessionContext);

  return (
    <Popup
      content="Cet article est réservé aux cotisants"
      disabled={!membersOnly}
      trigger={(
        <Card style={{width: 'min-content', minWidth: 'fit-content'}}>
          <Card.Content>
            <Card.Header>
              {membersOnly && user.is_member ? <Icon name="lock open" /> : null}
              {membersOnly && !user.is_member ? <Icon name="lock" /> : null}
              {name}
            </Card.Header>
            <Card.Meta>{price === '0.00' ? 'Gratuit' : `${price} €`}</Card.Meta>
            <Card.Meta>{minQuantityPerOrder === maxQuantityPerOrder ? `${maxQuantityPerOrder} par commande` : `De ${minQuantityPerOrder} à ${maxQuantityPerOrder} par commande`}</Card.Meta>

            <Card.Description style={{whiteSpace: 'pre-line'}}>
              {description}
            </Card.Description>
          </Card.Content>
          <Card.Content extra>
            <NumberInput
              disabled={disabled || (minQuantityPerOrder === maxQuantityPerOrder || (membersOnly && !user.is_member))}
              min={minQuantityPerOrder}
              max={maxQuantityPerOrder}
              onChange={(c) => {
                onChange({item: id, quantity: c});
              }}
            />
          </Card.Content>
        </Card>
      )}
    />
  );
};

export default ItemLine;
