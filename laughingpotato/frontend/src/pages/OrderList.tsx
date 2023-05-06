import React, {lazy, useEffect, useState} from 'react';
import {Button, Icon, Item, Segment,} from 'semantic-ui-react';
import {useNavigate} from 'react-router';

const FormattedDate = lazy(() => import('@sparkle/components/FormattedDate'));
const LoaderOverlay = lazy(() => import('@sparkle/components/LoaderOverlay'));

const OrderList = () => {
  const [orders, setOrders] = useState(null satisfies {
    next?: string;
    previous?: string,
    count: number,
    results: { id: number, sale: { title: string }, status: string }[]
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${process.env.LAUGHINGPOTATO_BASE_URL}/api/orders/?detailed_sale=true`.replace('//', '/'))
      .then((response) => response.json())
      .then((res) => {
        setOrders(res);
        setLoading(false);
      }).catch((errorData) => {
      setError(errorData.message);
      setLoading(false);
    });
  }, []);
  if (loading) return <LoaderOverlay />;

  if (error) {
    return (
      <Segment>
        Error :( (
        {error}
        )
      </Segment>
    );
  }

  return (
    <Segment>
      <Item.Group divided>
        {orders.results.map((order) => (
          <Item key={order.id}>
            <Item.Content>
              <Item.Header as="a">{order.sale.title}</Item.Header>
              <Item.Meta>
                {order.status === 'COMPLETED' && (
                  <span>Commande valide</span>
                )}
              </Item.Meta>
              <Item.Meta><FormattedDate isoString={order.created} /></Item.Meta>
              <Item.Description>{order.item}</Item.Description>
              {order.status === 'COMPLETED' && (
                <Item.Extra>
                  <Button
                    primary
                    floated="right"
                    onClick={() => navigate(`/orders/${order.id}/detail`.replace('//', '/'))}
                  >
                    View
                    <Icon name="chevron right" />
                  </Button>
                </Item.Extra>
              )}
            </Item.Content>
          </Item>
        ))}
      </Item.Group>
    </Segment>
  );
};

export default OrderList;
