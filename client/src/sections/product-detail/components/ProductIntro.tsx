"use client";

import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import Rating from "@mui/material/Rating";
import Button from "@mui/material/Button";
import Add from "@mui/icons-material/Add";
import Remove from "@mui/icons-material/Remove";
import Tooltip from "@mui/material/Tooltip";
import useCart from "../../../hooks/useCart";
import ProductModel from "../../../models/Product.model";
import { H1, H2 } from "../../../components/Typography";
import ProductDiscount from "../../../components/card/ProductDiscount";
import { formatCurrency } from "../../../utils/lib";
import { Typography } from "@mui/material";
import ImageWithHoverZoom from "./ImageWithHoverZoom";
import { notifySuccess } from "../../../utils/ToastNotification";

type Props = { product: ProductModel };

export default function ProductIntro({ product }: Props) {
  const {
    id,
    lowest_price,
    highest_price,
    name,
    images,
    short_description,
    variants,
    options,
    skus,
    review_point,
    vendor,
  } = product || {};

  const { state, addItemToCart } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariants, setSelectedVariants] = useState<{
    [key: string]: string;
  }>({});
  const [availableSkus, setAvailableSkus] = useState<ProductModel["skus"]>([]);
  const [currentSku, setCurrentSku] = useState<ProductModel["skus"][0] | null>(
    null
  );
  const [cartQty, setCartQty] = useState(1);
  const variantOptions: { [key: string]: string[] } = {};

  variants?.forEach((variant) => {
    variantOptions[variant] = options
      .filter((option) => Object.keys(option)[0] === variant)
      .map((option) => Object.values(option)[0]);
  });

  useEffect(() => {
    if (!variants || variants.length === 0) {
      setAvailableSkus(skus);
      setCurrentSku(skus[0] || null);
      return;
    }

    const filteredSkus = skus.filter((sku) => {
      return variants.every((variant) => {
        if (!selectedVariants[variant]) return true;
        return sku.variant_options[variant] === selectedVariants[variant];
      });
    });

    setAvailableSkus(filteredSkus);

    if (filteredSkus.length === 1) {
      setCurrentSku(filteredSkus[0]);
    } else {
      setCurrentSku(null);
    }
  }, [selectedVariants, skus, variants]);

  const handleVariantSelect = (variant: string, option: string) => () => {
    setSelectedVariants((prev) => ({
      ...prev,
      [variant]: prev[variant] === option ? "" : option,
    }));
  };

  const handleImageClick = (ind: number) => () => setSelectedImage(ind);
  console.log(state);
  const handleAddToCart = () => {
    if (!currentSku) {
      return;
    }
    addItemToCart(currentSku.id, cartQty);
  };

  const handleCartAmountChange = (newQty: number) => {
    if (newQty <= 0 || !currentSku || newQty > currentSku.in_stock) return;
    setCartQty(newQty);
  };

  return (
    <Box mx="auto" p={2}>
      <Grid container spacing={4}>
        <Grid item md={5} xs={12}>
          <ImageWithHoverZoom
            src={images[selectedImage]}
            alt={name}
            width={550}
            height={550}
          />
          {images.length > 1 && (
            <Box display="flex" overflow="auto" sx={{ mt: 1 }}>
              {images.map((url, ind) => (
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  key={ind}
                  width={64}
                  height={64}
                  minWidth={64}
                  bgcolor="white"
                  border="1px solid"
                  borderRadius="10px"
                  ml={ind === 0 ? "auto" : 0}
                  style={{ cursor: "pointer" }}
                  onClick={handleImageClick(ind)}
                  mr={ind === images.length - 1 ? "auto" : "10px"}
                  borderColor={
                    selectedImage === ind ? "primary.main" : "grey.400"
                  }
                >
                  <Avatar
                    alt="product"
                    src={url}
                    variant="square"
                    sx={{ height: 40 }}
                  />
                </Box>
              ))}
            </Box>
          )}
        </Grid>

        <Grid item md={6} xs={12}>
          <H1 mb={2}>{name}</H1>
          <Box
            mb={2}
            color="textSecondary"
            dangerouslySetInnerHTML={{ __html: short_description }}
          />

          <Box display="flex" alignItems="center" mb={2}>
            <Rating value={review_point} precision={0.5} readOnly />
          </Box>

          {variants?.map((variant) => (
            <Box key={variant} mb={2}>
              <Typography variant="subtitle1" fontWeight={500} mb={1}>
                {variant}:
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {variantOptions[variant].map((option) => (
                  <Tooltip key={option} title={option}>
                    <Chip
                      label={option}
                      clickable
                      color={
                        selectedVariants[variant] === option
                          ? "primary"
                          : "default"
                      }
                      onClick={handleVariantSelect(variant, option)}
                      variant={
                        selectedVariants[variant] === option
                          ? "filled"
                          : "outlined"
                      }
                      disabled={
                        !availableSkus.some(
                          (sku) =>
                            sku.variant_options[variant] === option &&
                            Object.keys(selectedVariants).every(
                              (selVariant) =>
                                !selectedVariants[selVariant] ||
                                sku.variant_options[selVariant] ===
                                  selectedVariants[selVariant]
                            )
                        )
                      }
                    />
                  </Tooltip>
                ))}
              </Box>
            </Box>
          ))}

          <Box mb={2}>
            {currentSku && currentSku.offer_price < currentSku.price ? (
              <ProductDiscount
                price={Number(currentSku.price)}
                discountPrice={Number(currentSku.offer_price)}
              />
            ) : (
              <H2 color="primary.main" fontWeight={600}>
                {formatCurrency(Number(currentSku?.price || highest_price))}
              </H2>
            )}
          </Box>

          <Box display="flex" alignItems="center" mb={2}>
            <Button
              size="small"
              color="primary"
              variant="outlined"
              onClick={() => handleCartAmountChange(cartQty - 1)}
              disabled={cartQty <= 1}
            >
              <Remove />
            </Button>

            <Typography variant="h6" mx={2}>
              {cartQty}
            </Typography>

            <Button
              size="small"
              color="primary"
              variant="outlined"
              onClick={() => handleCartAmountChange(cartQty + 1)}
              disabled={cartQty >= currentSku?.in_stock}
            >
              <Add />
            </Button>
          </Box>
          <Box mt={2}>
            {currentSku ? (
              currentSku.in_stock > 0 ? (
                <Typography variant="body1" color="success.main">
                  Còn hàng ({currentSku.in_stock} sản phẩm)
                </Typography>
              ) : (
                <Typography variant="body1" color="error.main">
                  Hết hàng
                </Typography>
              )
            ) : (
              <Typography variant="body1" color="error.main">
                Vui lòng chọn các tùy chọn để xem tình trạng hàng
              </Typography>
            )}
          </Box>

          <Button
            variant="contained"
            color="primary"
            disabled={!currentSku || currentSku.in_stock <= 0}
            onClick={handleAddToCart}
            fullWidth
            sx={{ height: 48, fontSize: "16px" }}
          >
            Thêm vào giỏ
          </Button>
          {variants && variants.length > 0 && (
            <Box mt={2}>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {variants.map((variant) => (
                  <Chip
                    key={variant}
                    label={`${variant}: ${
                      selectedVariants[variant] || "Chưa chọn"
                    }`}
                    color={selectedVariants[variant] ? "primary" : "default"}
                    variant={selectedVariants[variant] ? "filled" : "outlined"}
                  />
                ))}
              </Box>
            </Box>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
