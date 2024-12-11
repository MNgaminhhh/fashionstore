"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  CircularProgress,
  Alert,
  TextField,
  Button,
  Grid,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import VendorService from "../../../services/Vendor";
import File from "../../../services/File";
import { useAppContext } from "../../../context/AppContext";
import { useFormik } from "formik";
import * as Yup from "yup";
import { notifyError, notifySuccess } from "../../../utils/ToastNotification";
import MTDropZone from "../../../components/MTDropZone";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));

const VendorInfoCard: React.FC = () => {
  const { sessionToken } = useAppContext();
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const fetchVendor = async () => {
      try {
        const decoded = jwtDecode(sessionToken);
        const vendorId = decoded.vendorId;

        if (!vendorId) {
          setError("Không tìm thấy thông tin Vendor.");
          setLoading(false);
          return;
        }

        const response = await VendorService.findOne(vendorId, sessionToken);
        console.log(response.data.data);
        if (response.data.success) {
          setVendor(response.data.data);
        } else {
          setError(
            response.data.message || "Đã xảy ra lỗi khi lấy thông tin Vendor."
          );
        }
      } catch (err: any) {
        setError(err.message || "Đã xảy ra lỗi khi lấy thông tin Vendor.");
      } finally {
        setLoading(false);
      }
    };

    if (sessionToken) {
      fetchVendor();
    } else {
      setError("Không có session token.");
      setLoading(false);
    }
  }, [sessionToken]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      store_name: vendor?.store_name || "",
      phone_number: vendor?.phone_number || "",
      email: vendor?.user_email || "", // Thêm trường email
      description: vendor?.description || "",
      address: vendor?.address || "",
      banner: null as File | null,
    },
    validationSchema: Yup.object({
      store_name: Yup.string().required("Tên cửa hàng là bắt buộc"),
      phone_number: Yup.string()
        .matches(
          /^[0-9]{10,15}$/,
          "Số điện thoại phải chứa từ 10 đến 15 chữ số"
        )
        .required("Số điện thoại là bắt buộc"),
      email: Yup.string()
        .email("Email không hợp lệ")
        .required("Email là bắt buộc"),
      description: Yup.string(),
      address: Yup.string().required("Địa chỉ là bắt buộc"),
      banner: Yup.mixed().nullable(),
    }),
    onSubmit: async (values) => {
      const decode = jwtDecode(sessionToken);
      const vendorId = decode.vendorId;

      if (!vendorId) {
        notifyError("Không tìm thấy thông tin Vendor.");
        return;
      }

      let imageUrl = vendor?.banner || "";
      if (values.banner) {
        const formData = new FormData();
        formData.append("file", values.banner);
        try {
          const uploadRes = await File.upload(formData, sessionToken);
          if (
            uploadRes.data.success &&
            uploadRes.data.data.files &&
            uploadRes.data.data.files.length > 0
          ) {
            imageUrl = uploadRes.data.data.files[0];
          } else {
            notifyError("Tải ảnh lên thất bại");
            return;
          }
        } catch (err: any) {
          notifyError(err.message || "Đã xảy ra lỗi khi tải ảnh lên.");
          return;
        }
      }

      const updateData = {
        store_name: values.store_name,
        phone_number: values.phone_number,
        user_email: values.email,
        description: values.description,
        address: values.address,
        banner: imageUrl,
      };

      setUploading(true);
      try {
        const response = await VendorService.update(updateData, sessionToken);
        if (response?.success || response?.data.success) {
          notifySuccess("Thông tin Vendor đã được cập nhật thành công.");
          setVendor(response.data);
          router.refresh();
        } else {
          notifyError(
            response.data.message || "Cập nhật thông tin Vendor thất bại."
          );
        }
      } catch (err: any) {
        notifyError(err.message || "Đã xảy ra lỗi khi cập nhật Vendor.");
      } finally {
        setUploading(false);
      }
    },
  });

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ marginBottom: 4 }}>
        {error}
      </Alert>
    );
  }

  if (!vendor) {
    return null;
  }

  return (
    <StyledCard>
      <form onSubmit={formik.handleSubmit} encType="multipart/form-data">
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="store_name"
                name="store_name"
                label="Tên cửa hàng"
                value={formik.values.store_name}
                onChange={formik.handleChange}
                error={
                  formik.touched.store_name && Boolean(formik.errors.store_name)
                }
                helperText={
                  formik.touched.store_name && formik.errors.store_name
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="phone_number"
                name="phone_number"
                label="Số điện thoại"
                value={formik.values.phone_number}
                onChange={formik.handleChange}
                error={
                  formik.touched.phone_number &&
                  Boolean(formik.errors.phone_number)
                }
                helperText={
                  formik.touched.phone_number && formik.errors.phone_number
                }
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="email"
                name="email"
                label="Email"
                type="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="address"
                name="address"
                label="Địa chỉ"
                value={formik.values.address}
                onChange={formik.handleChange}
                error={formik.touched.address && Boolean(formik.errors.address)}
                helperText={formik.touched.address && formik.errors.address}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                id="description"
                name="description"
                label="Mô tả"
                multiline
                rows={4}
                value={formik.values.description}
                onChange={formik.handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <MTDropZone
                onChange={(files: File[]) => {
                  if (files.length > 0) {
                    formik.setFieldValue("banner", files[0]);
                  }
                }}
                initialImage={vendor.banner}
                title="Kéo & thả hình ảnh banner vào đây hoặc chọn tệp"
                imageSize="Tải lên ảnh banner kích thước tối thiểu 1024x1024"
              />
            </Grid>
          </Grid>
        </CardContent>
        <Box
          display="flex"
          justifyContent="flex-end"
          alignItems="center"
          p={2}
          pt={0}
        >
          {formik.dirty && (
            <Button
              color="primary"
              variant="contained"
              type="submit"
              disabled={uploading}
            >
              {uploading ? <CircularProgress size={24} /> : "Cập nhật"}
            </Button>
          )}
        </Box>
      </form>
    </StyledCard>
  );
};

export default VendorInfoCard;
