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
import useProduct from "../hooks/useProduct";
import { ProductDiscount2 } from "../ProductDiscount";

type Props = {
  title: string;
  slug: string;
  price: number;
  imgUrl: string[];
  rating?: number;
  discountPrice?: string;
  discount?: any;
  id: string | number;
  hideRating?: boolean;
  hoverEffect?: boolean;
  showProductSize?: boolean;
};

export default function CardProduct1({
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
  discountPrice,
}: Props) {
  const { cartItem, toggleDialog } = useProduct(slug);

  return (
    <StyledCard hoverEffect={hoverEffect}>
      <ImageWrapper>
        <DiscountChip discount={discount} />
        <HoverActions toggleView={toggleDialog} />
        <Link href={`/product/${slug}`}>
          <Box
            width="400px"
            height="400px"
            overflow="hidden"
            position="relative"
          >
            <BaseImage
              priority
              src={imgUrl.length > 0 ? imgUrl[0] : "/placeholder.png"}
              width={400}
              height={400}
              alt={title}
              style={{ objectFit: "cover" }}
            />
          </Box>
        </Link>
      </ImageWrapper>

      <ContentWrapper>
        <Box flex="1 1 0" minWidth="0px" mr={1}>
          <ProductTitle title={title} slug={slug} />

          <Rating size="small" value={rating} color="warn" readOnly />

          <ProductDiscount2
            price={price}
            discountPrice={discountPrice}
            nocenter
          />
        </Box>

        <QuantityButtons quantity={cartItem?.qty || 0} slug={slug} />
      </ContentWrapper>
    </StyledCard>
  );
}
