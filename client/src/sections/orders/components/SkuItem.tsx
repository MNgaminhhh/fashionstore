"use client";

import React from "react";
import {
  Box,
  Typography,
  Chip,
  Card,
  CardContent,
  CardMedia,
  Stack,
  Divider,
} from "@mui/material";
import { parse, format } from "date-fns";
import { formatCurrency } from "../../../utils/lib";
import Image from "next/image";
import styled from "@emotion/styled";

const StyledCard = styled(Card)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  borderRadius: "12px",
  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
  transition: "transform 0.3s, box-shadow 0.3s",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
  },
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
  },
}));

const ImageBox = styled(Box)(({ theme }) => ({
  position: "relative",
  width: "150px",
  height: "150px",
  borderRadius: "12px",
  overflow: "hidden",
  flexShrink: 0,
  [theme.breakpoints.down("sm")]: {
    width: "100%",
    height: "200px",
  },
  "&:hover img": {
    transform: "scale(1.1)",
  },
}));

const SkuItem = ({ sku }: any) => {
  return (
    <StyledCard>
      <ImageBox>
        <Image
          src={sku.product_image[0]}
          alt={sku.product_name}
          layout="fill"
          objectFit="cover"
          priority={false}
          style={{ transition: "transform 0.5s ease" }}
        />
      </ImageBox>
      <CardContent sx={{ flex: "1 0 auto" }}>
        <Stack spacing={1}>
          <Typography variant="h6" component="div" fontWeight="bold">
            {sku.product_name}
          </Typography>
          <Divider />
          <Box display="flex" flexDirection="column" gap={0.5}>
            <Typography variant="body1">
              <strong>Số Lượng:</strong> {sku.quantity}
            </Typography>
            <Typography variant="body1">
              <strong>Giá:</strong> {formatCurrency(sku.price)}
            </Typography>
            <Typography variant="body1">
              <strong>Giá Ưu Đãi:</strong> {formatCurrency(sku.offer_price)}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </StyledCard>
  );
};

export default SkuItem;
