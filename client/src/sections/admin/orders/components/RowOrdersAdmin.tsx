"use client";

import React from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  StyledIconButton,
  StyledTableCell,
  StyledTableRow,
} from "../../../styles";
import { useRouter } from "next/navigation";
import { Tooltip, Chip } from "@mui/material";
type Props = {
  order: any;
  onDelete: (id: string) => void;
};

export default function RowOrdersAdmin({ order, onDelete }: Props) {
  const router = useRouter();

  const handleView = (orderId: string) => {
    router.push(`/dashboard/admin/orders/${orderId}`);
  };

  const formatOrderId = (orderId: string): string => {
    return orderId.length > 8
      ? `#${orderId.slice(0, 8).toUpperCase()}...`
      : `#${orderId.toUpperCase()}`;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Ngày không hợp lệ";
    }
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    };
    return date.toLocaleDateString("vi-VN", options);
  };

  const formatCurrency = (amount: number): string => {
    return amount.toLocaleString("vi-VN") + "₫";
  };

  const getStatusChip = (status: string) => {
    let color:
      | "default"
      | "primary"
      | "secondary"
      | "success"
      | "error"
      | "warning" = "default";
    let label = status;

    switch (status.toLowerCase()) {
      case "pending":
        color = "warning";
        label = "Đang Chuẩn Bị Hàng";
        break;
      case "paying":
        color = "warning";
        label = "Chờ Thanh Toán";
        break;
      case "shipping":
        color = "default";
        label = "Đang vận chuyển";
        break;
      case "delivered":
        color = "success";
        label = "Đã Giao Hàng";
        break;
      case "canceled":
        color = "error";
        label = "Hủy";
        break;
      default:
        color = "default";
    }

    return <Chip label={label} color={color} />;
  };

  return (
    <StyledTableRow tabIndex={-1} role="checkbox">
      <StyledTableCell align="left" sx={{ fontWeight: 400, color: "#333" }}>
        {formatDate(order.created_at)}
      </StyledTableCell>

      <StyledTableCell align="left" sx={{ fontWeight: 400, color: "#333" }}>
        {formatDate(order.updated_at)}
      </StyledTableCell>

      <StyledTableCell align="left" sx={{ fontWeight: 400, color: "#333" }}>
        {order.paying_method === "QR_CODE"
          ? "QR Code"
          : order.paying_method || "-"}
      </StyledTableCell>

      <StyledTableCell align="left" sx={{ fontWeight: 400, color: "#333" }}>
        {formatCurrency(order.total_bill)}
      </StyledTableCell>

      <StyledTableCell align="left" sx={{ fontWeight: 400, color: "#333" }}>
        {getStatusChip(order.order_status)}
      </StyledTableCell>

      <StyledTableCell align="center" sx={{ minWidth: 150 }}>
        <Tooltip title="Xem chi tiết" arrow>
          <StyledIconButton onClick={() => handleView(order.id)}>
            <VisibilityIcon sx={{ color: "#1976d2" }} />
          </StyledIconButton>
        </Tooltip>
      </StyledTableCell>
    </StyledTableRow>
  );
}
