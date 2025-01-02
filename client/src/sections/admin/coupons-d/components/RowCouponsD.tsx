"use client";

import React from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  StyledIconButton,
  StyledTableCell,
  StyledTableRow,
} from "../../../styles";
import { useRouter } from "next/navigation";
import { Tooltip } from "@mui/material";
import MTSwitch from "../../../../components/MTSwitch";
import CouponModel from "../../../../models/Coupon.model";
import VisibilityIcon from "@mui/icons-material/Visibility";

type Props = {
  coupon: CouponModel;
  onToggleStatus: (id: string, status: boolean) => void;
  onViewDetail: (coupon: CouponModel) => void;
};

const mappingType: { [key: string]: string } = {
  fixed: "Giá Cố Định",
  percentage: "Phí (%)",
  shipping_fixed: "Phí Vận Chuyển Cố Định",
  shipping_percentage: "Phí Vận Chuyển (%)",
};

export default function RowCouponsD({
  coupon,
  onToggleStatus,
  onViewDetail,
}: Props) {
  const router = useRouter();

  const handleEdit = (id: string) => {
    router.push(`/dashboard/admin/coupons-d/${id}`);
  };

  const handleToggleStatus = () => {
    onToggleStatus(coupon.id, !coupon.status);
  };
  const handleViewDetail = () => {
    onViewDetail(coupon);
  };
  return (
    <StyledTableRow tabIndex={-1} role="checkbox">
      <StyledTableCell sx={{ fontWeight: "400" }}>
        {coupon.name || "-"}
      </StyledTableCell>
      <StyledTableCell sx={{ fontWeight: "600" }}>
        {coupon.code || "-"}
      </StyledTableCell>
      <StyledTableCell sx={{ fontWeight: "400" }}>
        {mappingType[coupon.type] || coupon.type || "-"}
      </StyledTableCell>
      <StyledTableCell sx={{ fontWeight: "400" }}>
        {coupon.quantity || 0}
      </StyledTableCell>
      <StyledTableCell sx={{ fontWeight: "400" }}>
        {coupon.discount}
      </StyledTableCell>
      <StyledTableCell sx={{ fontWeight: "400" }}>
        {coupon.max_price}
      </StyledTableCell>
      <StyledTableCell sx={{ fontWeight: "600" }}>
        {`Từ ${coupon.startDate} Đến ${coupon.endDate}` || "-"}
      </StyledTableCell>
      <StyledTableCell sx={{ fontWeight: "400" }}>
        <MTSwitch
          color="info"
          checked={Boolean(coupon.status)}
          onChange={handleToggleStatus}
        />
      </StyledTableCell>
      <StyledTableCell align="center" sx={{ minWidth: 100 }}>
        <Tooltip title="Xem chi tiết" arrow>
          <StyledIconButton onClick={handleViewDetail}>
            <VisibilityIcon sx={{ color: "#000000" }} />
          </StyledIconButton>
        </Tooltip>
        <Tooltip title="Chỉnh sửa" arrow>
          <StyledIconButton onClick={() => handleEdit(coupon.id)}>
            <EditIcon sx={{ color: "#1976d2" }} />
          </StyledIconButton>
        </Tooltip>
      </StyledTableCell>
    </StyledTableRow>
  );
}
