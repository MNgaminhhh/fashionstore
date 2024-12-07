"use client";

import Link from "next/link";
import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";
import { ImageWrapper, ContentWrapper, StyledCard } from "./styles";
import BaseImage from "../../BaseImage";
import { Span } from "../../Typography";
import QuantityButtons from "./components/QuantityButtons";
import DiscountChip from "../DiscountChip";
import HoverActions from "./components/HoverActions";
import ProductTitle from "../ProductTitle";
import ProductPrice from "../ProductPrice";
import useProduct from "../hooks/useProduct";

type Props = {
  title: string;
  slug: string;
  price: number;
  imgUrl: string;
  rating?: number;
  discount?: number;
  id: string | number;
  hideRating?: boolean;
  hoverEffect?: boolean;
  showProductSize?: boolean;
};

export default function ProductCard1({
  id,
  slug,
  title,
  price,
  imgUrl,
  rating = 5,
  hideRating,
  hoverEffect,
  discount = 5,
  showProductSize,
}: Props) {
  const {
    isFavorite,
    openModal,
    cartItem,
    toggleDialog,
    toggleFavorite,
    handleCartAmountChange,
  } = useProduct(slug);

  const handleIncrementQuantity = () => {
    const product = {
      id,
      slug,
      price,
      imgUrl,
      name: title,
      qty: (cartItem?.qty || 0) + 1,
    };
    handleCartAmountChange(product);
  };

  const handleDecrementQuantity = () => {
    const product = {
      id,
      slug,
      price,
      imgUrl,
      name: title,
      qty: (cartItem?.qty || 0) - 1,
    };
    handleCartAmountChange(product, "remove");
  };

  return (
    <StyledCard hoverEffect={hoverEffect}>
      <ImageWrapper>
        <DiscountChip discount={discount} />
        <HoverActions
          isFavorite={isFavorite}
          toggleView={toggleDialog}
          toggleFavorite={toggleFavorite}
        />
        <Link href={`/products/${slug}`}>
          <BaseImage
            priority
            src={imgUrl}
            width={500}
            height={500}
            alt={title}
          />
        </Link>
      </ImageWrapper>

      <ContentWrapper>
        <Box flex="1 1 0" minWidth="0px" mr={1}>
          <ProductTitle title={title} slug={slug} />

          {!hideRating ? (
            <Rating size="small" value={rating} color="warn" readOnly />
          ) : null}

          {showProductSize ? (
            <Span color="grey.600" mb={1} display="block">
              Liter
            </Span>
          ) : null}

          <ProductPrice discount={discount} price={price} />
        </Box>

        <QuantityButtons
          quantity={cartItem?.qty || 0}
          handleIncrement={handleIncrementQuantity}
          handleDecrement={handleDecrementQuantity}
        />
      </ContentWrapper>
    </StyledCard>
  );
}
