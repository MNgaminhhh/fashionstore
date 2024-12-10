"use client";

import Link from "next/link";
import { useState } from "react";
import Rating from "@mui/material/Rating";
import BaseImage from "../../BaseImage";
import { FlexBetween } from "../../flexbox";
import { H6 } from "../../Typography";
import HoverBox from "../../HoverBox";
import { ProductDiscount2 } from "../ProductDiscount";

interface Props {
  off?: number;
  slug: string;
  title: string;
  price: number;
  discountPrice: number;
  imgUrl: string;
  rating: number;
  hideReview?: boolean;
  hideFavoriteIcon?: boolean;
}

export default function ProductCard2({
  slug,
  title,
  price,
  discountPrice,
  imgUrl,
  rating,
  off = 20,
  hideReview,
}: Props) {
  return (
    <div>
      <Link href={`/product/${slug}`}>
        <HoverBox overflow="hidden" borderRadius={2}>
          <BaseImage width={270} height={270} alt={title} src={imgUrl} />
        </HoverBox>
      </Link>

      <FlexBetween mt={2}>
        <div>
          <H6 mb={0.5} title={title} ellipsis>
            {title}
          </H6>

          {!hideReview ? (
            <Rating size="small" value={rating} color="warn" readOnly />
          ) : null}

          <ProductDiscount2 price={price} discountPrice={discountPrice} />
        </div>
      </FlexBetween>
    </div>
  );
}
