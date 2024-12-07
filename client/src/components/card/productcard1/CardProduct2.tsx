"use client";

import Link from "next/link";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Rating from "@mui/material/Rating";
import Favorite from "@mui/icons-material/Favorite";
import RemoveRedEye from "@mui/icons-material/RemoveRedEye";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
// import ProductViewDialog from "components/products-view/product-view-dialog";
import { formatCurrency } from "../../../utils/lib";
import BaseImage from "../../BaseImage";
import { StyledIconButton, Card, CardMedia, FavoriteButton } from "./styles";
import { H4, Paragraph, Small } from "../../Typography";
import { FlexCenterRow } from "../../flexbox";
import useProduct from "../hooks/useProduct";

type Props = { product: any };

export default function CardProduct2({ product }: Props) {
  console.log(product);
  const {
    cartItem,
    handleCartAmountChange,
    isFavorite,
    openModal,
    toggleDialog,
    toggleFavorite,
  } = useProduct(product.slug);

  const handleAddToCart = () => {
    const payload = {
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: product.highest_price || 0,
      imgUrl:
        product.images && product.images.length > 0
          ? product.images[0]
          : "/placeholder.png",
      qty: (cartItem?.qty || 0) + 1,
    };

    handleCartAmountChange(payload);
  };

  return (
    <Card>
      <CardMedia>
        <Link href={`/products/${product.slug}`}>
          <BaseImage
            width={300}
            height={300}
            alt="category"
            src={
              product.images && product.images.length > 0
                ? product.images[0]
                : "/placeholder.png"
            }
            className="product-img"
          />
        </Link>
        <StyledIconButton className="product-actions" onClick={toggleDialog}>
          <RemoveRedEye color="disabled" fontSize="small" />
        </StyledIconButton>
      </CardMedia>
      {/* <ProductViewDialog
        openDialog={openModal}
        handleCloseDialog={toggleDialog}
        product={{ id, slug, title, price, imgGroup: [thumbnail, thumbnail] }}
      /> */}

      <Box p={2} textAlign="center">
        <Paragraph>{product.name}</Paragraph>

        <H4 fontWeight={700} py={0.5}>
          {formatCurrency(product.highest_price || 0)}
        </H4>
        <FlexCenterRow gap={1} mb={2}>
          <Rating name="read-only" value={0} readOnly sx={{ fontSize: 14 }} />
          {/* <Small fontWeight={600} color="grey.500">
            ({reviews.length})
          </Small> */}
        </FlexCenterRow>
        <Button
          fullWidth
          color="dark"
          variant="outlined"
          onClick={handleAddToCart}
        >
          Add To Cart
        </Button>
      </Box>
    </Card>
  );
}
