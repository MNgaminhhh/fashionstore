import React from "react";
import {
  Card,
  CardMedia,
  Typography,
  IconButton,
  Box,
  Checkbox,
  Chip,
  Grid,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import useCart from "../../../hooks/useCart";
import { styled } from "@mui/material/styles";
import { formatCurrency } from "../../../utils/lib";

const StyledCard = styled(Card)(({ theme }) => ({
  display: "flex",
  alignItems: "flex-start",
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    alignItems: "center",
  },
  boxShadow: theme.shadows[3],
  borderRadius: theme.shape.borderRadius,
}));

const ImageBox = styled(Box)(({ theme }) => ({
  position: "relative",
  width: 100,
  height: 100,
  marginRight: theme.spacing(2),
  [theme.breakpoints.down("sm")]: {
    width: "100%",
    height: 100,
    marginRight: 0,
    marginBottom: theme.spacing(2),
  },
  borderRadius: theme.shape.borderRadius,
  overflow: "hidden",
}));

const ContentBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  flex: 1,
}));

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
  productName: string;
  variantImage: Record<string, string>;
  storeName: string;
  selected: boolean;
  readOnly?: boolean;
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
  productName,
  variantImage,
  storeName,
  selected,
  readOnly = false,
}) => {
  const { removeItemFromCart, toggleSelectItem } = useCart();

  const handleRemove = () => {
    if (!readOnly) removeItemFromCart(id);
  };

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!readOnly) toggleSelectItem(id);
  };

  return (
    <StyledCard>
      {!readOnly && (
        <Checkbox
          checked={selected}
          onChange={handleSelect}
          color="primary"
          sx={{ alignSelf: "start", marginRight: 2 }}
          inputProps={{ "aria-label": `Select ${productName}` }}
        />
      )}
      <ImageBox>
        <CardMedia
          component="img"
          image={productImages[0] || banner}
          alt={productName}
          loading="lazy"
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </ImageBox>
      <ContentBox>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
          mb={1}
        >
          <Box>
            <Typography component="div" variant="h6" sx={{ fontWeight: 600 }}>
              {productName}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ marginBottom: 1 }}>
          <Chip
            label={storeName}
            color="primary"
            size="small"
            sx={{ marginRight: 0.5, marginBottom: 0.5 }}
          />
          {Object.entries(variantImage).map(([key, value]) => (
            <Chip
              key={key}
              label={`${key}: ${value}`}
              variant="outlined"
              size="small"
              sx={{ marginRight: 0.5, marginBottom: 0.5 }}
            />
          ))}
        </Box>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Typography variant="body2" color="text.secondary">
              <strong>{formatCurrency(price)}</strong> x{" "}
              <strong>{quantity}</strong> ={" "}
              <strong>{formatCurrency(totalPrice)}</strong>
            </Typography>
          </Grid>
        </Grid>
      </ContentBox>
      {!readOnly && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            padding: 1,
          }}
        >
          <IconButton
            onClick={handleRemove}
            aria-label={`Remove ${productName} from cart`}
            color="error"
            sx={{
              transition: "transform 0.2s",
              "&:hover": {
                transform: "scale(1.1)",
              },
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      )}
    </StyledCard>
  );
};

export default CartItem;
