import React, { useState } from "react";
import {
  Grid,
  Dialog,
  DialogContent,
  IconButton,
  Divider,
  Typography,
  Box,
  Button,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SliderShow from "../../../../components/slider/SliderShow";
import MTImage from "../../../../components/MTImage";
import { H1, H2, Paragraph } from "../../../../components/Typography";
import Products from "../../../../services/Products";
import {
  notifyError,
  notifySuccess,
} from "../../../../utils/ToastNotification";

interface Props {
  product: any;
  openDialog: boolean;
  isApprov: boolean;
  handleCloseDialog: () => void;
  token?: string;
  onApprovalChange?: (newStatus: boolean) => void;
}

const mappingTypeProduct: { [key: string]: string } = {
  none: "Không Có",
  new_arrival: "Hàng Mới Về",
  best_product: "Sản Phẩm Tốt Nhất",
  featured_product: "Sản Phẩm Nổi Bật",
  top_product: "Sản Phẩm Hàng Đầu",
};

export default function DetailDialog(props: Props) {
  const {
    product,
    openDialog,
    isApprov,
    handleCloseDialog,
    token,
    onApprovalChange,
  } = props;
  const [isApproved, setIsApproved] = useState(isApprov);
  const [isLoading, setIsLoading] = useState(false);

  if (!product) return null;

  const handleApproval = async (newStatus: boolean) => {
    setIsLoading(true);
    try {
      const response = await Products.updateApproval(
        product.id,
        newStatus,
        token
      );
      if (response.data.success) {
        setIsApproved(newStatus);
        if (onApprovalChange) {
          onApprovalChange(newStatus);
        }
        handleCloseDialog();
      }
    } catch (err) {
      notifyError("Đã xảy ra lỗi. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      open={openDialog}
      onClose={handleCloseDialog}
      maxWidth="md"
      fullWidth
      sx={{ zIndex: 1501 }}
    >
      <DialogContent sx={{ width: "100%", position: "relative" }}>
        <IconButton
          sx={{ position: "absolute", top: 10, right: 10 }}
          onClick={handleCloseDialog}
        >
          <CloseIcon color="secondary" />
        </IconButton>

        <Grid container spacing={3}>
          <Grid item md={6} xs={12}>
            <SliderShow
              slidesToShow={1}
              arrowStyles={{
                boxShadow: 0,
                color: "primary.main",
                backgroundColor: "transparent",
              }}
            >
              {product.images.map((imgUrl: string, index: number) => (
                <MTImage
                  key={index}
                  src={imgUrl}
                  alt={`${product.name} Image ${index + 1}`}
                  sx={{
                    mx: "auto",
                    width: "100%",
                    objectFit: "contain",
                    height: { sm: 400, xs: 250 },
                  }}
                />
              ))}
            </SliderShow>
          </Grid>

          <Grid item md={6} xs={12}>
            <H2>{product.name || "N/A"}</H2>

            <Typography variant="body2" gutterBottom>
              {product.short_description || "N/A"}
            </Typography>
            <H1 color="primary.main">
              {product.highest_price
                ? `Giá: ${product.highest_price.toLocaleString()} VNĐ`
                : "Giá: N/A"}
            </H1>

            {product.lowest_price &&
              product.lowest_price < product.highest_price && (
                <Typography variant="h6" color="error" gutterBottom>
                  Giá Giảm: {`${product.lowest_price.toLocaleString()} VNĐ`}
                </Typography>
              )}

            <Divider sx={{ my: 2 }} />
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Thông Tin Chi Tiết:
              </Typography>
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <Typography variant="body2">
                    <strong>Nhà Cung Cấp:</strong> {product.store_name || "N/A"}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">
                    <strong>Danh Mục:</strong> {product.category_name || "N/A"}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">
                    <strong>Loại Sản Phẩm:</strong>{" "}
                    {mappingTypeProduct[product.product_type] ||
                      product.product_type ||
                      "-"}
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="body2">
                    <strong>Tình Trạng:</strong>{" "}
                    {product.status === "active" ? "Còn hàng" : "Hết hàng"}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2">
                    <strong>Slug:</strong> {product.slug || "N/A"}
                  </Typography>
                </Grid>
              </Grid>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Mô Tả Chi Tiết:
              </Typography>
              <Typography
                variant="body2"
                gutterBottom
                dangerouslySetInnerHTML={{
                  __html: product.long_description || "<p>N/A</p>",
                }}
              />
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography variant="body2">
              <strong>Trạng thái phê duyệt:</strong>{" "}
              {isApproved ? "Đã Duyệt" : "Chưa Duyệt"}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Box mt={2} display="flex" gap={2}>
              {!isApproved ? (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleApproval(true)}
                  disabled={isLoading}
                >
                  {isLoading ? <CircularProgress size={24} /> : "Phê Duyệt"}
                </Button>
              ) : (
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => handleApproval(false)}
                  disabled={isLoading}
                >
                  {isLoading ? <CircularProgress size={24} /> : "Hủy Đã Duyệt"}
                </Button>
              )}
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}
