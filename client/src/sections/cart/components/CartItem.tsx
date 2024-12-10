import React from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
  Box,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import useCart from "../../../hooks/useCart";

interface CartItemProps {
  id: string;
  skuId: string;
  quantity: number;
  price: number;
  offerPrice: number;
  totalPrice: number;
  totalOfferPrice: number;
  productImages: string[];
  banner: string;
}

const CartItem: React.FC<CartItemProps> = ({
  id,
  skuId,
  quantity,
  price,
  offerPrice,
  totalPrice,
  totalOfferPrice,
  productImages,
  banner,
}) => {
  const { removeFromCart, updateQuantity } = useCart();

  const handleRemove = () => {
    removeFromCart(id);
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(e.target.value, 10);
    if (newQuantity > 0) {
      updateQuantity(id, newQuantity);
    }
  };

  return (
    <Card sx={{ display: "flex", mb: 2 }}>
      <CardMedia
        component="img"
        sx={{ width: 151 }}
        image={productImages[0] || banner}
        alt="Product Image"
      />
      <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
        <CardContent sx={{ flex: "1 0 auto" }}>
          {/* Replace 'Product Name' with actual product name if available */}
          <Typography component="div" variant="h6">
            Product Name
          </Typography>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            component="div"
          >
            SKU: {skuId}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Price: ₫{offerPrice.toLocaleString()}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Quantity:
            <input
              type="number"
              value={quantity}
              min="1"
              onChange={handleQuantityChange}
              style={{ width: "60px", marginLeft: "10px" }}
            />
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Total: ₫{totalOfferPrice.toLocaleString()}
          </Typography>
        </CardContent>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", pr: 2 }}>
        <IconButton onClick={handleRemove} aria-label="delete">
          <DeleteIcon />
        </IconButton>
      </Box>
    </Card>
  );
};

export default CartItem;
