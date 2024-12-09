"use client";
import {
  createContext,
  PropsWithChildren,
  useMemo,
  useReducer,
  useEffect,
  useState,
} from "react";
import Cart from "../services/Cart";
import { useAppContext } from "./AppContext";
import { Box, CircularProgress, Typography } from "@mui/material";
import { notifySuccess } from "../utils/ToastNotification";

type CartItem = {
  id: string;
  sku_id: string;
  quantity: number;
  price: number;
  offer_price: number;
  total_price: number;
  total_offer_price: number;
  product_image: string[];
  banner: string;
};

type CartActionType =
  | { type: "SET_CART"; payload: CartItem[] }
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: string };

const INITIAL_STATE = { cart: [] as CartItem[] };

interface ContextProps {
  state: { cart: CartItem[] };
  dispatch: (action: CartActionType) => void;
}

export const CartContext = createContext<ContextProps>({} as ContextProps);

const reducer = (state: { cart: CartItem[] }, action: CartActionType) => {
  switch (action.type) {
    case "SET_CART":
      return { ...state, cart: action.payload };
    case "ADD_ITEM":
      return { ...state, cart: [...state.cart, action.payload] };
    case "REMOVE_ITEM":
      return {
        ...state,
        cart: state.cart.filter((item) => item.id !== action.payload),
      };
    default:
      return state;
  }
};

const CartProvider = ({ children }: PropsWithChildren) => {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const [loading, setLoading] = useState(true);
  const { sessionToken } = useAppContext();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await Cart.getAllCart(sessionToken);
        if (response?.success || response?.data?.success) {
          dispatch({ type: "SET_CART", payload: response.data });
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  const addItemToCart = async (sku_id: string, quantity: number) => {
    try {
      const data = {
        sku_id,
        quantity,
      };
      const response = await Cart.create(data, sessionToken);
      if (response?.success || response?.data?.success) {
        const res = await Cart.getAllCart(sessionToken);
        if (res?.success || res?.data?.success) {
          dispatch({ type: "SET_CART", payload: res.data });
        }
        notifySuccess(`Thêm sản phẩm vào giỏ hàng thành công`);
      }
    } catch (error) {}
  };

  const removeItemFromCart = async (itemId: string) => {
    try {
      const response = await Cart.delete(itemId, sessionToken);
      if (response?.success || response?.data?.success) {
        const res = await Cart.getAllCart(sessionToken);
        if (res?.success || res?.data?.success) {
          dispatch({ type: "SET_CART", payload: res.data });
        }
        notifySuccess(`Xóa sản phẩm khỏi giỏ hàng thành công`);
      }
    } catch (error) {}
  };

  const contextValue = useMemo(
    () => ({
      state,
      dispatch,
      addItemToCart,
      removeItemFromCart,
    }),
    [state]
  );

  if (loading)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress size={50} color="primary" />
        <Typography variant="h6" ml={2}>
          Đang tải...
        </Typography>
      </Box>
    );

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
};

export default CartProvider;
