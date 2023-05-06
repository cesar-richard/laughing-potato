import React from 'react';

export interface CartItemState {
  item: number;
  quantity: number;
}

export interface CartState {
  cart: CartItemState[];
  updateCart: (data: CartItemState) => void;
  resetCart: () => void;
}

const CartContext = React.createContext({
  cart: [],
  updateCart: (data) => {
    // eslint-disable-next-line no-console
    console.error('updateCart not implemented', data);
  },
  resetCart: () => {
    // eslint-disable-next-line no-console
    console.error('resetCart not implemented');
  },
} satisfies CartState);

export default CartContext;
