export const ADD_TO_CART = "ADD_TO_CART";
export const CLEAR_ALL_CART = "CLEAR_ALL_CART";
export const addToCart = (product = {}, cart = []) => {
  let exists = false;
  if (cart.length > 0) {
    cart.map((item) => {
      if (item.id === product.id) {
        exists = true;
        item.qty++;
      }
      return item;
    });
  }
  if (!exists) {
    cart.push(product);
  }
  const total = cart.reduce((totalQTY, product) => totalQTY + product.qty, 0);
  let sum = cart.map((item) => {
    return item.price * item.qty;
  });
  sum = sum.reduce((a, b) => a + b, 0);
  return {
    type: ADD_TO_CART,
    payload: {
      cart: cart,
      total: total,
      sum: sum
    },
  };
};
export const clearAllCart = () => {
  const cart = [];
  const total = 0;
  const sum = 0;
  return {
    type: CLEAR_ALL_CART,
    payload: {
      cart: cart,
      total: total,
      sum : sum
    },
  };
};
