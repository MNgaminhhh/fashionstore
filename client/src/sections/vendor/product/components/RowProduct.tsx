import React, { useState } from "react";
import Edit from "@mui/icons-material/Edit";
import Delete from "@mui/icons-material/Delete";
import DisplaySettingsIcon from "@mui/icons-material/DisplaySettings";
import {
  StyledIconButton,
  StyledTableCell,
  StyledTableRow,
} from "../../../styles";
import { useRouter } from "next/navigation";
import MTSwitch from "../../../../components/MTSwitch";
import { Typography, Box, Tooltip, Divider } from "@mui/material";
import ProductModel from "../../../../models/Product.model";
import Image from "next/image";
import { StyledMenu, StyledMenuItem } from "../styles";

type Props = {
  product: ProductModel;
  onDelete: (id: string) => void;
  onToggleApproval: (id: string, newStatus: string) => void;
};
const mappingTypeProduct: { [key: string]: string } = {
  none: "Không Có",
  new_arrival: "Hàng Mới Về",
  best_product: "Sản Phẩm Tốt Nhất",
  featured_product: "Sản Phẩm Nổi Bật",
  top_product: "Sản Phẩm Hàng Đầu",
};
export default function RowProduct({
  product,
  onDelete,
  onToggleApproval,
}: Props) {
  const router = useRouter();
  const [status, setStatus] = useState<string>(
    product.status.toLowerCase() === "active" ? "active" : "inactive"
  );
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleVariant = (id: string) => {
    router.push(`/dashboard/vendor/product/${id}/variant`);
  };
  const handleEdit = (id: string) => {
    router.push(`/dashboard/vendor/product/${id}`);
  };

  const handleToggleStatus = () => {
    const newStatus = status === "active" ? "inactive" : "active";
    setStatus(newStatus);
    onToggleApproval(product.id, newStatus);
  };
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <StyledTableRow tabIndex={-1} role="checkbox">
      <StyledTableCell align="center">
        {product.images && product.images.length > 0 ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            width={80}
            height={80}
            style={{
              borderRadius: "10%",
              objectFit: "cover",
            }}
          />
        ) : (
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            -
          </Typography>
        )}
      </StyledTableCell>
      <StyledTableCell align="left" sx={{ fontWeight: 500, color: "#333" }}>
        {product.name || "-"}
      </StyledTableCell>
      <StyledTableCell align="left" sx={{ fontWeight: 400, color: "#555" }}>
        {product.category_name || "-"}
      </StyledTableCell>
      <StyledTableCell align="left" sx={{ fontWeight: 400, color: "#555" }}>
        {mappingTypeProduct[product.product_type] ||
          product.product_type ||
          "-"}
      </StyledTableCell>
      <StyledTableCell align="center" sx={{ fontWeight: 400 }}>
        <Typography
          variant="body2"
          sx={{
            color: product.is_approved ? "green" : "red",
            fontWeight: "bold",
          }}
        >
          {product.is_approved ? "Đã duyệt" : "Chưa duyệt"}
        </Typography>
      </StyledTableCell>
      <StyledTableCell align="center" sx={{ fontWeight: 400 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 1,
          }}
        >
          <MTSwitch
            color="info"
            checked={status === "active"}
            onChange={handleToggleStatus}
            inputProps={{ "aria-label": "Toggle Product Status" }}
          />
        </Box>
      </StyledTableCell>

      <StyledTableCell align="center" sx={{ minWidth: 150 }}>
        <StyledIconButton onClick={handleClick}>
          <DisplaySettingsIcon sx={{ color: "#000000" }} />
        </StyledIconButton>
        <StyledMenu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <StyledMenuItem
            onClick={() => {
              handleVariant(product.id);
              handleClose();
            }}
          >
            Cấu hình biến thể sản phẩm
          </StyledMenuItem>
          <Divider />
          <StyledMenuItem
            onClick={() => {
              handleEdit(product.id);
              handleClose();
            }}
          >
            SKU
          </StyledMenuItem>
        </StyledMenu>
        <Tooltip title="Chỉnh sửa" arrow>
          <StyledIconButton onClick={() => handleEdit(product.id)}>
            <Edit sx={{ color: "#1976d2" }} />
          </StyledIconButton>
        </Tooltip>
        <Tooltip title="Xoá" arrow>
          <StyledIconButton onClick={() => onDelete(product.id)}>
            <Delete sx={{ color: "#d32f2f" }} />
          </StyledIconButton>
        </Tooltip>
      </StyledTableCell>
    </StyledTableRow>
  );
}
