"use client";
import React, {
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
import { notifyError, notifySuccess } from "../utils/ToastNotification";
import { useRouter } from "next/navigation";

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
  selected?: boolean;
  store_name: any;
  variant_image: any;
  product_name: any;
};

type CartActionType =
  | { type: "SET_CART"; payload: CartItem[] }
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "TOGGLE_SELECT_ITEM"; payload: string }
  | { type: "SELECT_ALL"; payload: boolean };

const INITIAL_STATE = { cart: [] as CartItem[] };

interface ContextProps {
  state: { cart: CartItem[] };
  dispatch: (action: CartActionType) => void;
  addItemToCart: (sku_id: string, quantity: number) => Promise<void>;
  removeItemFromCart: (itemId: string) => Promise<void>;
  toggleSelectItem: (itemId: string) => void;
  selectAll: (select: boolean) => void;
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
    case "TOGGLE_SELECT_ITEM":
      return {
        ...state,
        cart: state.cart.map((item) =>
          item.id === action.payload
            ? { ...item, selected: !item.selected }
            : item
        ),
      };
    case "SELECT_ALL":
      return {
        ...state,
        cart: state?.cart?.map((item) => ({
          ...item,
          selected: action.payload,
        })),
      };
    default:
      return state;
  }
};

const CartProvider = ({ children }: PropsWithChildren) => {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const [loading, setLoading] = useState(true);
  const { sessionToken, setCart } = useAppContext();
  const router = useRouter();

  // Check for existing cart data in localStorage/sessionStorage
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      // If cart data exists in localStorage, load it directly
      dispatch({ type: "SET_CART", payload: JSON.parse(storedCart) });
      setLoading(false); // No need to show loading if data is already available
    } else {
      // Otherwise, fetch the cart from API
      fetchCart();
    }
  }, []);

  const fetchCart = async () => {
    try {
      const response = await Cart.getAllCart(sessionToken);
      if (response?.success || response?.data?.success) {
        const cartWithSelection = response.data.map((item: CartItem) => ({
          ...item,
          selected: false,
        }));
        dispatch({ type: "SET_CART", payload: cartWithSelection });
        localStorage.setItem("cart", JSON.stringify(cartWithSelection)); // Store cart in localStorage
      }
    } catch (error) {
      notifyError("Không thể tải giỏ hàng.");
    } finally {
      setLoading(false);
    }
  };

  const addItemToCart = async (sku_id: string, quantity: number) => {
    if (!sessionToken) {
      notifyError("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng.");
      router.push("/login");
      return;
    }

    const data = { sku_id, quantity };
    const response = await Cart.create(data, sessionToken);
    if (response?.success || response?.data?.success) {
      const res = await Cart.getAllCart(sessionToken);
      if (res?.success || res?.data?.success) {
        const cartWithSelection = res?.data?.map((item: CartItem) => ({
          ...item,
          selected: false,
        }));
        dispatch({ type: "SET_CART", payload: cartWithSelection });
        localStorage.setItem("cart", JSON.stringify(cartWithSelection)); // Update localStorage
        setCart(cartWithSelection.length);
      }
      notifySuccess(`Thêm sản phẩm vào giỏ hàng thành công`);
    }
  };

  const removeItemFromCart = async (itemId: string) => {
    if (!sessionToken) {
      notifyError("Bạn cần đăng nhập để xóa sản phẩm khỏi giỏ hàng.");
      router.push("/login");
      return;
    }

    const response = await Cart.delete(itemId, sessionToken);
    if (response?.success || response?.data?.success) {
      notifySuccess(`Xóa sản phẩm khỏi giỏ hàng thành công`);
      dispatch({ type: "REMOVE_ITEM", payload: itemId });
      const res = await Cart.getAllCart(sessionToken);
      if (res?.success || res?.data?.success) {
        const cartWithSelection = res?.data?.map((item: CartItem) => ({
          ...item,
          selected: false,
        }));
        dispatch({ type: "SET_CART", payload: cartWithSelection });
        localStorage.setItem("cart", JSON.stringify(cartWithSelection)); // Update localStorage
        setCart(cartWithSelection?.length || 0);
      }
    }
  };

  const toggleSelectItem = (itemId: string) => {
    dispatch({ type: "TOGGLE_SELECT_ITEM", payload: itemId });
  };

  const selectAll = (select: boolean) => {
    dispatch({ type: "SELECT_ALL", payload: select });
  };

  const contextValue = useMemo(
    () => ({
      state,
      dispatch,
      addItemToCart,
      removeItemFromCart,
      toggleSelectItem,
      selectAll,
    }),
    [state]
  );

  return (
    <CartContext.Provider value={contextValue}>
      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100vh"
        >
          <CircularProgress />
        </Box>
      ) : (
        children
      )}
    </CartContext.Provider>
  );
};

export default CartProvider;
