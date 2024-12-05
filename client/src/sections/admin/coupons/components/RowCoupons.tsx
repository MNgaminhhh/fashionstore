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

type Props = {
  coupon: any;
  onDelete: (id: string) => void;
};

const mappingType: { [key: string]: string } = {
  price: "Giá",
  shipping_cost: "Phí vận chuyển",
};
export default function RowCoupon({ coupon, onDelete }: Props) {
  const router = useRouter();

  const handleEdit = (id: string) => {
    router.push(`/dashboard/admin/coupons/${id}`);
  };

  const handleDelete = (id: string) => {
    onDelete(id);
  };

  return (
    <StyledTableRow tabIndex={-1} role="checkbox">
      <StyledTableCell align="left" sx={{ fontWeight: 400, color: "#333" }}>
        {mappingType[coupon.Field] || coupon.Field || "-"}
      </StyledTableCell>
      <StyledTableCell align="left" sx={{ fontWeight: 400, color: "#333" }}>
        {coupon.Operator || "-"}
      </StyledTableCell>
      <StyledTableCell align="left" sx={{ fontWeight: 400, color: "#333" }}>
        {coupon.Value.price !== undefined ? coupon.Value.price : "-"}
      </StyledTableCell>
      <StyledTableCell align="left" sx={{ fontWeight: 400, color: "#333" }}>
        {coupon.Description || "-"}
      </StyledTableCell>
      <StyledTableCell align="center" sx={{ minWidth: 150 }}>
        <Tooltip title="Chỉnh sửa" arrow>
          <StyledIconButton onClick={() => handleEdit(coupon.ID)}>
            <EditIcon sx={{ color: "#1976d2" }} />
          </StyledIconButton>
        </Tooltip>
        <Tooltip title="Xoá" arrow>
          <StyledIconButton onClick={() => handleDelete(coupon.ID)}>
            <DeleteIcon sx={{ color: "#d32f2f" }} />
          </StyledIconButton>
        </Tooltip>
      </StyledTableCell>
    </StyledTableRow>
  );
}
