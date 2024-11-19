import { useCallback, useState } from "react";
import { useToastNotification } from "../../../hooks/useToastNotification";

export default function useProduct(slug: string) {
    const { notifySuccess, notifyError } = useToastNotification();
    const [openModal, setOpenModal] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [cart, setCart] = useState<any[]>([]); // Trạng thái giỏ hàng

    const toggleFavorite = useCallback(() => setIsFavorite((fav) => !fav), []);
    const toggleDialog = useCallback(() => setOpenModal((open) => !open), []);

    const cartItem = cart.find((item) => item.slug === slug);

    const handleCartAmountChange = (product: any, type?: "remove") => {
        setCart((prevCart) => {
            if (type === "remove") {
                notifyError("Xóa ra khỏi giỏ hàng");
                return prevCart.filter((item) => item.slug !== product.slug);
            } else {
                notifySuccess("Đã thêm vào giỏ hàng");
                const existingItem = prevCart.find((item) => item.slug === product.slug);
                if (existingItem) {
                    return prevCart;
                }
                return [...prevCart, product];
            }
        });
    };

    return {
        cartItem,
        openModal,
        isFavorite,
        toggleDialog,
        toggleFavorite,
        handleCartAmountChange,
    };
}