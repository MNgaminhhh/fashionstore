import { useCallback, useState } from "react";

export default function useProduct(slug: string) {
  const [openModal, setOpenModal] = useState(false);
  const [cart, setCart] = useState<any[]>([]);
  const toggleDialog = useCallback(() => setOpenModal((open) => !open), []);

  const cartItem = cart.find((item) => item.slug === slug);

  return {
    cartItem,
    openModal,
    toggleDialog,
  };
}
