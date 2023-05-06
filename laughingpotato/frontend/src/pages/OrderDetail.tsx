import React, {lazy, useEffect, useState} from 'react';
import {Button, Card, Dimmer, Header, Icon, Segment,} from 'semantic-ui-react';
import {useParams} from 'react-router';
import {QRCodeSVG} from 'qrcode.react';

const LoaderOverlay = lazy(() => import('@sparkle/components/LoaderOverlay'));

const OrderDetail = () => {
  const {orderId} = useParams();
  const [order, setOrder] = useState(null satisfies { id: number, sale: { title: string }, status: string });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dimmer, setDimmer] = useState(null);

  useEffect(() => {
    fetch(`${process.env.LAUGHINGPOTATO_BASE_URL}/api/orders/${orderId}/`)
      .then((response) => response.json())
      .then((res: { id: number, sale: { title: string }, status: string }) => {
        if (res.status && res.status === 'COMPLETED') {
          setOrder(res);
          setLoading(false);
          return res;
        }
        throw new Error('Cette commande n\'existe pas ou n\'est pas encore validée.');
      }).catch((errorData) => {
      setError(errorData.message);
      setLoading(false);
    });
  }, [orderId]);
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
      <Header textAlign="center">
        {order.sale.title}
      </Header>
      <Card.Group>
        {order.items.map((item) => (
          <Card key={item.item.id}>
            <Card.Content>
              <Card.Header as="a">{item.item.name}</Card.Header>
            </Card.Content>
            <Card.Content extra>
              <Button onClick={() => setDimmer(item.barcode)} primary floated="right">
                <Icon name="qrcode" />
                Afficher le QR Code
              </Button>
            </Card.Content>
          </Card>
        ))}
      </Card.Group>
      <Dimmer active={dimmer !== null} onClickOutside={() => setDimmer(null)} page>
        {dimmer && (
          <QRCodeSVG value={dimmer} level="H" includeMargin />
        )}
      </Dimmer>
    </Segment>
  );
};

export default OrderDetail;
