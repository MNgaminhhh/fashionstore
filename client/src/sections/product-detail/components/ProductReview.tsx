"use client";

import React from "react";
import Box from "@mui/material/Box";
import ProductComment from "./ProductComment";
import ReviewModel from "../../../models/Review.model";
import { Typography } from "@mui/material";

interface Props {
  vendorid: string;
  reviews: any;
  onDeleteReview: (deletedReviewId: string) => void;
  onUpdateReview: (updatedReview: any) => void;
}

export default function ProductReview({
  vendorid,
  reviews,
  onDeleteReview,
  onUpdateReview,
}: Props) {
  return (
    <>
      <Box>
        {reviews?.length > 0 ? (
          reviews.map((review) => (
            <ProductComment
              idV={vendorid}
              key={review.id}
              review={review}
              onDelete={onDeleteReview}
              onUpdate={onUpdateReview}
            />
          ))
        ) : (
          <Box textAlign="center" mt={4}>
            <Typography variant="body1" color="textSecondary">
              Chưa có đánh giá nào.
            </Typography>
          </Box>
        )}
      </Box>
    </>
  );
}
