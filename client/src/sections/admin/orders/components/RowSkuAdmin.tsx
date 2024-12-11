"use client";

import React from "react";
import { StyledTableCell, StyledTableRow } from "../../../styles";
import { Tooltip, Chip, Box, Typography } from "@mui/material";

type Props = {
  sku: any;
};

export default function RowSkuAdmin({ sku }: Props) {
  const formatCurrency = (amount: number): string => {
    return amount.toLocaleString("vi-VN") + "₫";
  };

  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("vi-VN", options);
  };

  const getPreparedChip = (isPrepared: boolean) => {
    return (
      <Chip
        label={isPrepared ? "Đã chuẩn bị" : "Chưa chuẩn bị"}
        color={isPrepared ? "success" : "warning"}
      />
    );
  };

  return (
    <StyledTableRow tabIndex={-1} role="checkbox">
      <StyledTableCell align="left" sx={{ fontWeight: 400, color: "#333" }}>
        <Box display="flex" alignItems="center" gap={2}>
          {sku.product_image && sku.product_image.length > 0 ? (
            <img
              src={sku.product_image[0]}
              alt={sku.product_name}
              style={{ width: "50px", height: "50px", objectFit: "cover" }}
            />
          ) : (
            <img
              src="/default-product.png"
              alt="Default Product"
              style={{ width: "50px", height: "50px", objectFit: "cover" }}
            />
          )}
          <Typography variant="body1">
            {sku.product_name || "Tên sản phẩm"}
          </Typography>
        </Box>
      </StyledTableCell>

      <StyledTableCell align="left" sx={{ fontWeight: 400, color: "#333" }}>
        {sku.quantity || 0}
      </StyledTableCell>

      <StyledTableCell align="left" sx={{ fontWeight: 400, color: "#333" }}>
        {formatCurrency(sku.price)}
      </StyledTableCell>

      <StyledTableCell align="left" sx={{ fontWeight: 400, color: "#333" }}>
        {formatCurrency(sku.offer_price)}
      </StyledTableCell>

      <StyledTableCell align="left" sx={{ fontWeight: 400, color: "#333" }}>
        {formatDate(sku.updated_at)}
      </StyledTableCell>

      <StyledTableCell align="left" sx={{ fontWeight: 400, color: "#333" }}>
        {getPreparedChip(sku.is_prepared)}
      </StyledTableCell>
    </StyledTableRow>
  );
}
