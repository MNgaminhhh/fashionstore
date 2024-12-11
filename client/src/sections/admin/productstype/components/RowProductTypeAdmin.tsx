import React, { useState } from "react";
import {
  StyledIconButton,
  StyledTableCell,
  StyledTableRow,
} from "../../../styles";
import { useRouter } from "next/navigation";
import MTSwitch from "../../../../components/MTSwitch";
import { Typography, Box, Tooltip } from "@mui/material";
import ProductModel from "../../../../models/Product.model";
import Image from "next/image";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DetailDialog from "./DetailDialog";
import { useAppContext } from "../../../../context/AppContext";
type Props = {
  product: ProductModel;
  onProductTypeChange?: (id: string, newType: string) => void;
};
const mappingTypeProduct: { [key: string]: string } = {
  none: "Không Có",
  new_arrival: "Hàng Mới Về",
  best_product: "Sản Phẩm Tốt Nhất",
  featured_product: "Sản Phẩm Nổi Bật",
  top_product: "Sản Phẩm Hàng Đầu",
};

const typeColorMapping: { [key: string]: string } = {
  none: "#B0BEC5",
  new_arrival: "#4CAF50",
  best_product: "#FF9800",
  featured_product: "#2196F3",
  top_product: "#9C27B0",
  default: "#757575",
};

export default function RowProductTypeAdmin({
  product,
  onProductTypeChange,
}: Props) {
  const router = useRouter();
  const { sessionToken } = useAppContext();
  const [status, setStatus] = useState(product.status === "active");
  const [isApproved, setIsApproved] = useState(product.is_approved);
  const [detailOpen, setDetailOpen] = useState(false);
  const handleViewDetailProduct = () => {
    setDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setDetailOpen(false);
  };

  return (
    <>
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
        <StyledTableCell align="left" sx={{ fontWeight: 400 }}>
          {product.name || "-"}
        </StyledTableCell>
        <StyledTableCell align="left" sx={{ fontWeight: 400 }}>
          {product.store_name || "-"}
        </StyledTableCell>
        <StyledTableCell align="left" sx={{ fontWeight: 400 }}>
          {product.category_name || 0}
        </StyledTableCell>
        <StyledTableCell align="left" sx={{ fontWeight: 400 }}>
          <Box display="flex" flexDirection="column">
            <Typography variant="body2" color="text.primary">
              Giá hiện tại:{" "}
              <strong>
                {product.highest_price ? `${product.highest_price}` : "-"}
              </strong>
            </Typography>
            {product.lowest_price &&
              product.lowest_price < product.highest_price && (
                <Typography variant="body2" color="error">
                  Giá giảm giá: <strong>{`${product.lowest_price}`}</strong>
                </Typography>
              )}
          </Box>
        </StyledTableCell>

        <StyledTableCell align="center" sx={{ fontWeight: 400 }}>
          <Typography
            variant="body2"
            sx={{
              color: status ? "green" : "red",
              fontWeight: "bold",
            }}
          >
            {status ? "Hiển thị" : "Ẩn"}
          </Typography>
        </StyledTableCell>
        <StyledTableCell align="left" sx={{ fontWeight: 400 }}>
          <Box
            sx={{
              display: "inline-block",
              padding: "4px 8px",
              borderRadius: "12px",
              backgroundColor:
                typeColorMapping[product.product_type] ||
                typeColorMapping["default"],
              color: "#fff",
              textTransform: "capitalize",
              fontSize: "0.875rem",
            }}
          >
            {mappingTypeProduct[product.product_type] ||
              product.product_type ||
              "-"}
          </Box>
        </StyledTableCell>
        <StyledTableCell align="center" sx={{ minWidth: 110 }}>
          <Tooltip title="Xem chi tiết" arrow>
            <StyledIconButton onClick={handleViewDetailProduct}>
              <VisibilityIcon />
            </StyledIconButton>
          </Tooltip>
        </StyledTableCell>
      </StyledTableRow>
      <DetailDialog
        openDialog={detailOpen}
        isApprov={isApproved}
        handleCloseDialog={handleCloseDetail}
        product={product}
        token={sessionToken}
        onProductTypeChange={onProductTypeChange}
      />
    </>
  );
}
