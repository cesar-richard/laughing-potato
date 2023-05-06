import React, {lazy, useEffect, useState} from 'react';
import {Button, Header, Icon, Label, Segment,} from 'semantic-ui-react';
import {useParams} from 'react-router';
import {Link} from 'react-router-dom';

const LoaderOverlay = lazy(() => import('@sparkle/components/LoaderOverlay'));

const OrderSuccess = () => {
  const {orderId} = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${process.env.LAUGHINGPOTATO_BASE_URL}/api/orders/${orderId}/`)
      .then((response) => response.json())
      .then((res: { status: string }) => {
        if (res.status && res.status === 'COMPLETED') {
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
        Votre commande a été validée ! Merci ! 🎉
      </Header>
      <div style={{textAlign: 'center', marginTop: '2em'}}>
        Vous pouvez retrouver vos billets dans
        {' '}
        <Label>Mes commandes</Label>
      </div>
      <div style={{textAlign: 'center', marginTop: '2em'}}>
        Ou directement ici
        {' '}
        <Button as={Link} to={`/orders/${orderId}/detail`} primary>
          <Icon name="qrcode" />
          Voir mes billets
        </Button>
      </div>
    </Segment>
  );
};

export default OrderSuccess;
