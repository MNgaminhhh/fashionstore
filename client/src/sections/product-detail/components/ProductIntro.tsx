"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import Rating from "@mui/material/Rating";
import Button from "@mui/material/Button";
import Add from "@mui/icons-material/Add";
import Remove from "@mui/icons-material/Remove";
import useCart from "../../../hooks/useCart";
import ProductModel from "../../../models/Product.model";
import { FlexBox, FlexCenterRow } from "../../../components/flexbox";
import BaseImage from "../../../components/BaseImage";
import { H1, H2, H3, H6 } from "../../../components/Typography";
import ProductDiscount from "../../../components/card/ProductDiscount";
import { formatCurrency } from "../../../utils/lib";

type Props = { product: ProductModel };
export default function ProductIntro({ product }: Props) {
  const { id, lowest_price, highest_price, name, images, slug } = product || {};

  const { state, dispatch } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectVariants, setSelectVariants] = useState({
    option: "option 1",
    type: "type 1",
  });

  const handleChangeVariant = (variantName: string, value: string) => () => {
    setSelectVariants((state) => ({
      ...state,
      [variantName.toLowerCase()]: value,
    }));
  };

  const cartItem = state.cart.find((item) => item.id === id);

  const handleImageClick = (ind: number) => () => setSelectedImage(ind);

  const handleCartAmountChange = (amount: number) => () => {
    dispatch({
      type: "CHANGE_CART_AMOUNT",
      payload: {
        lowest_price,
        highest_price,
        qty: amount,
        name: name,
        imgUrl: images,
        id,
        slug,
      },
    });
  };

  return (
    <Box width="90%" alignItems="center">
      <Grid container spacing={3} justifyContent="space-around">
        <Grid item md={5} xs={12} alignItems="center">
          <FlexBox
            borderRadius={3}
            overflow="hidden"
            justifyContent="center"
            mb={3}
            height={500}
          >
            <BaseImage
              alt={name}
              width={300}
              height={300}
              loading="eager"
              src={product.images[selectedImage]}
              objectFit="cover"
            />
          </FlexBox>

          <FlexBox overflow="auto">
            {images.map((url, ind) => (
              <FlexCenterRow
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
              </FlexCenterRow>
            ))}
          </FlexBox>
        </Grid>

        <Grid item md={6} xs={12}>
          <H1 mb={1}>{name}</H1>

          <Box display="flex" mb={1}>
            <div>{`Tên cửa hàng: `}</div>
            <H6>{` ${product.vendor.store_name}`}</H6>
          </Box>

          <Box display="flex" gap={1} mb={2}>
            <Box lineHeight="1">Rated:</Box>
            <Rating color="warn" value={4} readOnly />
            <H6 lineHeight="1">(50)</H6>
          </Box>

          <Box pt={1} mb={3}>
            {lowest_price != highest_price ? (
              <ProductDiscount
                price={Number(highest_price)}
                discountPrice={Number(lowest_price)}
              ></ProductDiscount>
            ) : (
              <H2 color="primary.main" mb={0.5} lineHeight="1">
                {formatCurrency(Number(lowest_price))}
              </H2>
            )}
          </Box>

          {!cartItem?.qty ? (
            <Button
              color="primary"
              variant="contained"
              onClick={handleCartAmountChange(1)}
              sx={{ mb: 4.5, px: "1.75rem", height: 40 }}
            >
              Thêm vào giỏ
            </Button>
          ) : (
            <FlexBox alignItems="center" mb={4.5}>
              <Button
                size="small"
                sx={{ p: 1 }}
                color="primary"
                variant="outlined"
                onClick={handleCartAmountChange(cartItem?.qty - 1)}
              >
                <Remove fontSize="small" />
              </Button>

              <H3 fontWeight="600" mx={2.5}>
                {cartItem?.qty.toString().padStart(2, "0")}
              </H3>

              <Button
                size="small"
                sx={{ p: 1 }}
                color="primary"
                variant="outlined"
                onClick={handleCartAmountChange(cartItem?.qty + 1)}
              >
                <Add fontSize="small" />
              </Button>
            </FlexBox>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
