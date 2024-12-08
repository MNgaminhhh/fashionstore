"use client";

import Link from "next/link";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Rating from "@mui/material/Rating";
import RemoveRedEye from "@mui/icons-material/RemoveRedEye";
import { formatCurrency } from "../../../utils/lib";
import BaseImage from "../../BaseImage";
import { StyledIconButton, Card, CardMedia } from "./styles";
import { H4, Paragraph, Small } from "../../Typography";
import { FlexCenterRow } from "../../flexbox";
import useProduct from "../hooks/useProduct";
import { Tooltip } from "@mui/material";
import ProductViewDialog from "../productsdialog/ProductViewDialog";

type Props = { product: any };

export default function CardProduct2({ product }: Props) {
  console.log(product);
  if (!product) return null;

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
        <Box minHeight="300px" position="relative">
          <Link href={`/products/${product.slug}`}>
            <BaseImage
              fill
              alt={product.name || "product"}
              src={
                product.images && product.images.length > 0
                  ? product.images[0]
                  : "/placeholder.png"
              }
              className="product-img"
              layout="fill"
              objectFit="cover"
            />
          </Link>
        </Box>
        <StyledIconButton className="product-actions" onClick={toggleDialog}>
          <Tooltip title="Xem nhanh" arrow>
            <RemoveRedEye color="disabled" fontSize="small" />
          </Tooltip>
        </StyledIconButton>
      </CardMedia>
      <ProductViewDialog
        openDialog={openModal}
        handleCloseDialog={toggleDialog}
        product={product}
      />

      <Box
        p={2}
        textAlign="center"
        display="flex"
        flexDirection="column"
        flexGrow={1}
        maxWidth="100%"
      >
        <Paragraph
          sx={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {product.name}
        </Paragraph>

        <H4
          fontWeight={700}
          py={0.5}
          sx={{ maxHeight: "2.5em", overflow: "hidden" }}
        >
          {formatCurrency(product.highest_price || 0)}
        </H4>

        <FlexCenterRow gap={1} mb={2}>
          <Rating name="read-only" value={0} readOnly sx={{ fontSize: 14 }} />
          {/* <Small fontWeight={600} color="grey.500">
      ({reviews.length})
    </Small> */}
        </FlexCenterRow>

        <Box mt="auto">
          <Button
            fullWidth
            color="dark"
            variant="outlined"
            onClick={handleAddToCart}
          >
            Thêm vào giỏ
          </Button>
        </Box>
      </Box>
    </Card>
  );
}
