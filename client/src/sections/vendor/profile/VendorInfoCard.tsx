"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Chip,
  CircularProgress,
  Alert,
  TextField,
  Button,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  FormControl,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Vendor from "../../../services/Vendor";
import { useAppContext } from "../../../context/AppContext";
import { useFormik } from "formik";
import * as Yup from "yup";
import { notifyError, notifySuccess } from "../../../utils/ToastNotification";
import { jwtDecode } from "jwt-decode";

const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));

const VendorInfoCard: React.FC = () => {
  const { sessionToken, setSessionToken, setCart } = useAppContext();
  const [vendor, setVendor] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);

  useEffect(() => {
    const fetchVendor = async () => {
      try {
        const decode: any = jwtDecode(sessionToken);
        const vendorId = decode?.vendorId;

        if (!vendorId) {
          setError("Không tìm thấy thông tin Vendor.");
          setLoading(false);
          return;
        }

        const data = await Vendor.findOne(vendorId);
        if (data.data.success) {
          setVendor(data.data.data);
        } else {
          setError(data.message || "Đã xảy ra lỗi khi lấy thông tin Vendor.");
        }
      } catch (err: any) {
        setError(err.message || "Đã xảy ra lỗi khi lấy thông tin Vendor.");
      } finally {
        setLoading(false);
      }
    };

    fetchVendor();
  }, [sessionToken]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      store_name: vendor?.store_name || "",
      phone_number: vendor?.phone_number || "",
      description: vendor?.description || "",
      address: vendor?.address || "",
      banner: null,
    },
    validationSchema: Yup.object({
      store_name: Yup.string().required("Tên cửa hàng là bắt buộc"),
      phone_number: Yup.string()
        .matches(
          /^[0-9]{10,15}$/,
          "Số điện thoại phải chứa từ 10 đến 15 chữ số"
        )
        .required("Số điện thoại là bắt buộc"),
      description: Yup.string(),
      address: Yup.string().required("Địa chỉ là bắt buộc"),
      banner: Yup.mixed().nullable(),
    }),
    onSubmit: async (values) => {
      const decode: any = jwtDecode(sessionToken);
      const vendorId = decode?.vendorId;

      if (!vendorId) {
        notifyError("Không tìm thấy thông tin Vendor.");
        return;
      }

      const formData = new FormData();
      formData.append("store_name", values.store_name);
      formData.append("phone_number", values.phone_number);
      formData.append("description", values.description);
      formData.append("address", values.address);
      if (values.banner) {
        formData.append("banner", values.banner);
      }

      setUploading(true);
      try {
        const response = await Vendor.update(vendorId, formData, sessionToken);
        if (response.success) {
          notifySuccess("Thông tin Vendor đã được cập nhật thành công.");
          setVendor(response.data.data);
        } else {
          notifyError(
            response.message || "Cập nhật thông tin Vendor thất bại."
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

            <Grid item xs={12}>
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
              <Button variant="contained" component="label">
                Upload Banner
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(event) => {
                    if (
                      event.currentTarget.files &&
                      event.currentTarget.files[0]
                    ) {
                      formik.setFieldValue(
                        "banner",
                        event.currentTarget.files[0]
                      );
                    }
                  }}
                />
              </Button>
              {formik.values.banner && (
                <Typography variant="body2" sx={{ marginTop: 1 }}>
                  {formik.values.banner.name}
                </Typography>
              )}
              {!formik.values.banner && vendor.banner && (
                <Typography variant="body2" sx={{ marginTop: 1 }}>
                  Banner hiện tại
                </Typography>
              )}
            </Grid>
          </Grid>

          <Box display="flex" alignItems="center" gap={1} mt={2}>
            <Typography variant="body1" fontWeight="bold">
              Trạng thái:
            </Typography>
            <Chip
              label={
                vendor.status === "accepted" ? "Đã xác nhận" : "Chưa xác nhận"
              }
              color={vendor.status === "accepted" ? "success" : "warning"}
            />
          </Box>

          <Box mt={2}>
            <Typography variant="h6">Thông tin người dùng</Typography>
            <Typography variant="body1">
              <strong>Tên đầy đủ:</strong> {vendor.user_full_name}
            </Typography>
            <Typography variant="body1">
              <strong>Email:</strong> {vendor.user_email}
            </Typography>
            <Box mt={1}>
              <img
                src={vendor.user_avatar || "/default-avatar.png"}
                alt={`${vendor.user_full_name} Avatar`}
                style={{ width: "100px", height: "100px", borderRadius: "50%" }}
              />
            </Box>
          </Box>
        </CardContent>
        <Box
          display="flex"
          justifyContent="flex-end"
          alignItems="center"
          p={2}
          pt={0}
        >
          <Button
            color="primary"
            variant="contained"
            type="submit"
            disabled={uploading}
          >
            {uploading ? <CircularProgress size={24} /> : "Cập nhật"}
          </Button>
        </Box>
      </form>
    </StyledCard>
  );
};

export default VendorInfoCard;
