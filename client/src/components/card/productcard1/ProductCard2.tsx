// components/card/productcard1/ProductCard2.tsx

"use client";

import Link from "next/link";
import Rating from "@mui/material/Rating";
import BaseImage from "../../BaseImage";
import { FlexBetween } from "../../flexbox";
import { H6 } from "../../Typography";
import HoverBox from "../../HoverBox";
import { ProductDiscount2 } from "../ProductDiscount";
import { Box, Typography } from "@mui/material";

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
  off = 0,
  hideReview,
}: Props) {
  return (
    <Box
      sx={{
        width: 380,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        position: "relative",
        padding: 2,
        boxSizing: "border-box",
        border: "1px solid #e0e0e0",
        borderRadius: 2,
        transition: "box-shadow 0.3s",
        "&:hover": {
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
        },
        backgroundColor: "#fff",
      }}
    >
      <Link href={`/product/${slug}`}>
        <HoverBox
          overflow="hidden"
          borderRadius={2}
          width="100%"
          sx={{
            position: "relative",
            paddingTop: "100%",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
            }}
          >
            <BaseImage
              layout="fill"
              objectFit="cover"
              alt={title}
              src={imgUrl}
              sizes="(max-width: 300px) 100vw, 300px"
            />
          </Box>
        </HoverBox>
      </Link>

      {off > 0 && (
        <Box
          sx={{
            position: "absolute",
            top: 16,
            left: 16,
            backgroundColor: "red",
            color: "white",
            padding: "4px 8px",
            borderRadius: "4px",
            fontWeight: "bold",
            fontSize: "0.875rem",
          }}
        >
          -{off}%
        </Box>
      )}

      <Box sx={{ mt: 2, flexGrow: 1 }}>
        <H6
          mb={0.5}
          title={title}
          ellipsis
          sx={{
            fontSize: "1rem",
            height: "2.4em",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {title}
        </H6>

        <ProductDiscount2
          price={price}
          discountPrice={discountPrice}
          nocenter
        />

        {!hideReview && (
          <Rating
            size="small"
            value={rating}
            color="warning"
            readOnly
            sx={{ mb: 1 }}
          />
        )}
      </Box>
    </Box>
  );
}
