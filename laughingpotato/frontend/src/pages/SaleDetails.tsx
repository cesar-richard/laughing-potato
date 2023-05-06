import React, {lazy, useEffect, useRef, useState,} from 'react';
import {Button, Card, Divider, Header, Icon, Label, Message, Segment,} from 'semantic-ui-react';
import {useParams} from 'react-router';
import type {CartItemState, CartState} from '@sparkle/utils/CartContext';
import CartContext from '@sparkle/utils/CartContext';
import {csrfToken} from '@sparkle/utils/csrfToken';
import {DateTime} from 'luxon';
import {toast} from 'react-toastify';
import type {ApiItemCamelCase, ApiSale, ApiSaleCamelCase} from '@sparkle/Types';
import {useInterval} from 'react-use';

const LoaderOverlay = lazy(() => import('@sparkle/components/LoaderOverlay'));
const ItemLine = lazy(() => import('@sparkle/components/ItemLine'));
const FormattedDate = lazy(() => import('@sparkle/components/FormattedDate'));

const SalesDetails = () => {
  const {slug} = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null satisfies ApiSaleCamelCase);
  const [paymentRunning, setPaymentRunning] = useState(false);
  const [saleClosed, setSaleClosed] = useState(true);
  const [cart, setCart] = useState<CartState['cart']>([]);
  const currentDateTime = useRef(DateTime.now().toISO());

  useInterval(() => {
    if (loading || !data?.startDate || !data?.endDate) return;
    const now = DateTime.now().toISO();
    if (now > data.endDate && currentDateTime.current <= data.endDate) {
      setSaleClosed(true);
      toast.info('La vente est terminée');
    } else if (now >= data.startDate && currentDateTime.current < data.startDate) {
      setSaleClosed(false);
      toast.info('La vente a commencé');
    }
    currentDateTime.current = DateTime.now().toISO();
  }, 1000);

  useEffect(() => {
    fetch(`${process.env.LAUGHINGPOTATO_BASE_URL}/api/sales/${slug}/`)
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        }
        return new Promise((resolve, reject) => {
          reject(response.json());
        });
      }).then((res: ApiSale) => {
      setData({
        slug: res.slug,
        title: res.title,
        description: res.description,
        startDate: res.start_date,
        endDate: res.end_date,
        association: res.association,
        itemSet: res.item_set.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          description: item.description,
          quantity: item.quantity,
          membersOnly: item.members_only,
          idWeezpay: item.id_weezpay,
          maxQuantityPerOrder: item.max_quantity_per_order,
          minQuantityPerOrder: item.min_quantity_per_order,
          maxQuantityPerUser: item.max_quantity_per_user,
        })),
      });
      setSaleClosed(DateTime.now().toISO() >= res.end_date || DateTime.now().toISO() < res.start_date);
      setLoading(false);
    }).catch((errorData) => {
      errorData.then((e: any) => {
        setError(e.detail);
        setLoading(false);
      });
    });
  }, [slug]);
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

  const handlePay = () => {
    if (paymentRunning) return;
    setPaymentRunning(true);
    const tweakedCart = [];
    cart.forEach((i) => {
      if (i.quantity > 0) {
        for (let j = 0; j < i.quantity; j++) {
          tweakedCart.push({item: i.item, quantity: 1});
        }
      }
    });

    const body = {
      sale: data.slug,
      items: tweakedCart,
    };
    fetch(`${process.env.LAUGHINGPOTATO_BASE_URL}/api/orders/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken(),
      },
      body: JSON.stringify(body),
    }).then((response) => new Promise((resolve, reject) => {
      if (response.status === 201) {
        resolve(response.json());
      } else {
        reject(response.json());
      }
    })).then((e: any) => {
      window.location = e.payment_url;
    }).catch((errorData) => {
      errorData.then((e: string[]) => {
        toast.error(e[0]);
        setPaymentRunning(false);
      });
    });
  };

  const updateCart = (itemState: CartItemState) => {
    const existingItem = cart.find((item) => item.item === itemState.item);
    if (itemState.quantity === 0) {
      setCart(cart.filter((item) => item.item !== itemState.item));
      return;
    }
    if (existingItem) {
      existingItem.quantity = itemState.quantity;
    } else {
      cart.push(itemState);
    }
    setCart([...cart]);
  };

  return (
    <CartContext.Provider
      value={{cart, updateCart: (itemState) => updateCart(itemState), resetCart: () => setCart([])}}
    >
      <Segment>
        <Header as="h1" textAlign="center">
          {data.title}
        </Header>
        {saleClosed && (
          <Message info>
            <Message.Header style={{textAlign: 'center'}}>
              Cette vente est fermée en ce moment
            </Message.Header>
          </Message>
        )}
        <Divider horizontal>
          <Header as="h4">
            <Icon name="clock" />
            Horaires de la vente
          </Header>
        </Divider>
        <div style={{textAlign: 'center'}}>
          <Label><FormattedDate isoString={data.startDate} /></Label>
          -
          <Label><FormattedDate isoString={data.endDate} /></Label>
        </div>

        {data.location && (
          <>
            <Divider horizontal>
              <Header as="h4">
                <Icon name="pin" />
                Lieu
              </Header>
            </Divider>
            <div style={{textAlign: 'center'}}>
              {data.location}
            </div>
          </>
        )}
        <Divider horizontal>
          <Header as="h4">
            <Icon name="tag" />
            Description
          </Header>
        </Divider>
        <p style={{textAlign: 'center', whiteSpace: 'pre-line'}}>
          {data.description}
        </p>
        <Divider horizontal>
          <Header as="h4">
            <Icon name="cart" />
            Articles
          </Header>
        </Divider>
        <Card.Group>
          {data.itemSet.map(({
                               id,
                               price,
                               description,
                               membersOnly,
                               maxQuantityPerOrder,
                               minQuantityPerOrder,
                               name,
                             }: ApiItemCamelCase) => (
            <ItemLine
              key={id}
              price={price}
              minQuantityPerOrder={minQuantityPerOrder}
              maxQuantityPerOrder={maxQuantityPerOrder}
              name={name}
              id={id}
              membersOnly={membersOnly}
              description={description}
              onChange={updateCart}
              disabled={saleClosed}
            />
          ))}
        </Card.Group>
        <Divider />
        <Button
          color="green"
          disabled={cart.length === 0 || saleClosed}
          loading={paymentRunning}
          onClick={handlePay}
        >
          Payer
        </Button>
      </Segment>
    </CartContext.Provider>
  );
};

export default SalesDetails;
