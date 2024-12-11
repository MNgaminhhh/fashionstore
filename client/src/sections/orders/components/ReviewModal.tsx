// components/ReviewModal.tsx

"use client";

import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Rating from "@mui/material/Rating";
import * as yup from "yup";
import { useFormik } from "formik";
import ReviewService from "../../../services/Review";
import File from "../../../services/File";
import { notifyError, notifySuccess } from "../../../utils/ToastNotification";
import { useAppContext } from "../../../context/AppContext";
import MTDropZone from "../../../components/MTDropZone";

interface SKU {
  sku_id: string;
  product_name: string;
  // Thêm các trường khác nếu cần
}

interface ReviewModalProps {
  open: boolean;
  onClose: () => void;
  orderId: string;
  skus: SKU[];
  orderIdForReview: string;
}

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "90%", sm: 500 },
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

const ReviewModal: React.FC<ReviewModalProps> = ({
  open,
  onClose,
  orderId,
  skus,
  orderIdForReview,
}) => {
  console.log("sku" + skus);
  const { sessionToken } = useAppContext();
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const validationSchema = yup.object().shape({
    selectedSKU: yup.string().required("Vui lòng chọn SKU để đánh giá"),
    rating: yup.number().required("Vui lòng chọn đánh giá"),
    comment: yup.string().required("Vui lòng nhập nội dung bình luận"),
  });

  const formik = useFormik({
    initialValues: {
      selectedSKU: "",
      rating: 0,
      comment: "",
      date: new Date().toISOString(),
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      if (!sessionToken) {
        notifyError("Bạn cần đăng nhập để viết đánh giá.");
        return;
      }

      let commentArray: { content: string; content_type: string }[] = [];

      // Thêm nội dung bình luận
      commentArray.push({
        content: values.comment,
        content_type: "text",
      });

      // Tải lên hình ảnh nếu có
      if (imageFiles.length > 0) {
        for (const file of imageFiles) {
          const formData = new FormData();
          formData.append("file", file);
          try {
            const uploadRes = await File.upload(formData, sessionToken);
            if (
              uploadRes.data.success &&
              uploadRes.data.data.files &&
              uploadRes.data.data.files.length > 0
            ) {
              // Giả sử API trả về URL của hình ảnh trong files[0].url
              const imageUrl = uploadRes.data.data.files[0].url;
              commentArray.push({
                content: imageUrl,
                content_type: "image",
              });
            } else {
              notifyError("Tải ảnh lên thất bại");
              return;
            }
          } catch (err: any) {
            notifyError(err.message || "Đã xảy ra lỗi khi tải ảnh lên.");
            return;
          }
        }
      }

      // Tạo dữ liệu để gửi
      const data = {
        rating: values.rating,
        sku_id: values.selectedSKU,
        order_id: orderIdForReview,
        comment: commentArray,
      };

      setIsSubmitting(true);
      try {
        const response = await ReviewService.create(data, sessionToken);
        if (response.data.success) {
          notifySuccess("Đánh giá của bạn đã được gửi thành công.");
          resetForm();
          setImageFiles([]);
          onClose();
        } else {
          notifyError(response.data.message || "Gửi đánh giá thất bại.");
        }
      } catch (err: any) {
        notifyError(err.message || "Đã xảy ra lỗi khi gửi đánh giá.");
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const handleImageChange = (files: File[]) => {
    if (files.length > 0) {
      setImageFiles(files);
    }
  };

  // Nếu chỉ có một SKU, tự động chọn nó
  useEffect(() => {
    if (open && skus.length === 1) {
      formik.setFieldValue("selectedSKU", skus[0].sku_id);
    }
    // Nếu không, hãy để người dùng chọn
    if (open && skus.length > 1) {
      formik.setFieldValue("selectedSKU", "");
    }
    // Reset khi modal đóng
    if (!open) {
      formik.resetForm();
      setImageFiles([]);
    }
  }, [open, skus]);

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="review-modal-title">
      <Box sx={style}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography id="review-modal-title" variant="h6" component="h2">
            Đánh Giá Đơn Hàng
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <form onSubmit={formik.handleSubmit}>
          {/* Chọn SKU */}
          <Box mb={2}>
            <FormControl
              fullWidth
              variant="outlined"
              error={
                !!formik.touched.selectedSKU && !!formik.errors.selectedSKU
              }
            >
              <InputLabel id="select-sku-label">Chọn SKU</InputLabel>
              <Select
                labelId="select-sku-label"
                id="select-sku"
                name="selectedSKU"
                value={formik.values.selectedSKU}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                label="Chọn SKU"
                disabled={skus.length === 1}
              >
                {skus.map((sku) => (
                  <MenuItem key={sku.sku_id} value={sku.sku_id}>
                    {sku.product_name} - SKU: {sku.sku_id}
                  </MenuItem>
                ))}
              </Select>
              {formik.touched.selectedSKU && formik.errors.selectedSKU && (
                <Typography color="error" variant="caption">
                  {formik.errors.selectedSKU}
                </Typography>
              )}
            </FormControl>
          </Box>

          {/* Đánh Giá */}
          <Box mb={2}>
            <Typography component="legend">Đánh Giá của Bạn</Typography>
            <Rating
              name="rating"
              value={formik.values.rating}
              onChange={(_, value: number) =>
                formik.setFieldValue("rating", value)
              }
            />
            {formik.touched.rating && formik.errors.rating && (
              <Typography color="error" variant="caption">
                {formik.errors.rating}
              </Typography>
            )}
          </Box>

          {/* Bình Luận */}
          <Box mb={2}>
            <TextField
              label="Nội Dung Bình Luận"
              name="comment"
              multiline
              rows={4}
              fullWidth
              variant="outlined"
              value={formik.values.comment}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={!!formik.touched.comment && !!formik.errors.comment}
              helperText={formik.touched.comment && formik.errors.comment}
            />
          </Box>

          {/* Upload Hình Ảnh */}
          <Box mb={2}>
            <Typography variant="subtitle1" gutterBottom>
              Thêm hình ảnh (tùy chọn)
            </Typography>
            <MTDropZone onChange={handleImageChange} />
            {imageFiles.length > 0 && (
              <Box mt={2}>
                <Typography variant="body2" color="grey.700" mb={1}>
                  Bạn đã chọn {imageFiles.length} hình ảnh.
                </Typography>
                <Box display="flex" gap={2} flexWrap="wrap">
                  {imageFiles.map((file, index) => (
                    <Box key={index} position="relative">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${index}`}
                        style={{
                          width: "100px",
                          height: "100px",
                          objectFit: "cover",
                          borderRadius: "8px",
                        }}
                      />
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
          </Box>

          {/* Nút Gửi */}
          <Box display="flex" justifyContent="flex-end">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isSubmitting || !(formik.dirty && formik.isValid)}
            >
              {isSubmitting ? <CircularProgress size={24} /> : "Gửi"}
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default ReviewModal;
