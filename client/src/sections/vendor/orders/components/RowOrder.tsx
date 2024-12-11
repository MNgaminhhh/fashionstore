"use client";

import React from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  StyledIconButton,
  StyledTableCell,
  StyledTableRow,
} from "../../../styles";
import { useRouter } from "next/navigation";
import { Tooltip, Typography, Link as MuiLink } from "@mui/material";

type Props = {
  order: any;
};

export default function RowOrder({ order }: Props) {
  const router = useRouter();

  const handleView = (orderId: string) => {
    router.push(`/dashboard/vendor/orders/${orderId}`);
  };

  return (
    <StyledTableRow tabIndex={-1} role="checkbox">
      <StyledTableCell align="left" sx={{ fontWeight: 500, color: "#1976d2" }}>
        <MuiLink
          component="button"
          variant="body1"
          onClick={() => handleView(order.order_id)}
          underline="hover"
          sx={{ cursor: "pointer" }}
        >
          #{formatOrderId(order.order_id)}
        </MuiLink>
      </StyledTableCell>
      <StyledTableCell align="center" sx={{ minWidth: 150 }}>
        <Tooltip title="Xem chi tiết" arrow>
          <StyledIconButton onClick={() => handleView(order.order_id)}>
            <VisibilityIcon sx={{ color: "#1976d2" }} />
          </StyledIconButton>
        </Tooltip>
      </StyledTableCell>
    </StyledTableRow>
  );
}

function formatOrderId(orderId: string): string {
  return orderId.length > 15
    ? `${orderId.slice(0, 15).toUpperCase()}`
    : orderId.toUpperCase();
}
