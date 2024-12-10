"use client";
import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Stack,
  Grid,
  Paper,
  Divider,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import MTDropZone from "../../../../components/MTDropZone";
import File from "../../../../services/File";
import {
  notifyError,
  notifySuccess,
} from "../../../../utils/ToastNotification";
import Vendor from "../../../../services/Vendor";
import { H2 } from "../../../../components/Typography";
import { useRouter } from "next/navigation";

interface BecomeVendorFormValues {
  address: string;
  email: string;
  phone_number: string;
  store_name: string;
  full_name: string;
  banner: string;
}

const BecomeVendorPage = ({ token }: { token: string }) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const router = useRouter();
  const initialValues: BecomeVendorFormValues = {
    address: "",
    email: "",
    phone_number: "",
    store_name: "",
    full_name: "",
    banner: "",
  };

  const validationSchema = Yup.object({
    address: Yup.string().required("Vui lòng nhập địa chỉ"),
    email: Yup.string()
      .email("Email không hợp lệ")
      .required("Vui lòng nhập email"),
    phone_number: Yup.string().required("Vui lòng nhập số điện thoại"),
    store_name: Yup.string().required("Vui lòng nhập tên cửa hàng"),
    full_name: Yup.string().required("Vui lòng nhập họ tên"),
    banner: Yup.string().required("Vui lòng chọn banner"),
  });

  const formik = useFormik<BecomeVendorFormValues>({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      let imageUrl = values.banner;
      if (selectedFiles.length > 0) {
        const formData = new FormData();
        formData.append("file", selectedFiles[0]);
        try {
          const uploadRes = await File.upload(formData, token);
          if (
            uploadRes.data.success &&
            uploadRes.data.data &&
            uploadRes.data.data.files.length > 0
          ) {
            imageUrl = uploadRes.data.data.files[0];
          } else {
            notifyError("Tải ảnh lên thất bại");
            return;
          }
        } catch (error) {
          notifyError("Có lỗi xảy ra khi tải ảnh");
          return;
        }
      }

      const finalValues = { ...values, banner: imageUrl };

      try {
        const response = await Vendor.becomeVendor(finalValues, token);
        if (response?.success || response?.data?.success) {
          notifySuccess(
            "Đăng ký thành công!. Vui lòng đợi quản trị viên duyệt hồ sơ!"
          );
          router.push("/");
        } else {
          notifyError("Đăng ký không thành công. Vui lòng thử lại.");
        }
      } catch (error) {
        notifyError("Có lỗi xảy ra. Vui lòng thử lại.");
      }
    },
  });

  const handleFilesChange = (files: File[]) => {
    setSelectedFiles(files);
    if (files.length > 0) {
      formik.setFieldValue("banner", files[0].name);
    } else {
      formik.setFieldValue("banner", "");
    }
  };

  return (
    <Box sx={{ py: 4, px: 2, bgcolor: "grey.100" }}>
      <Paper
        elevation={3}
        sx={{
          maxWidth: 1000,
          mx: "auto",
          p: { xs: 2, md: 4 },
          borderRadius: 2,
          backgroundColor: "#fff",
        }}
      >
        <Box mb={3} textAlign="center">
          <H2 mb={1} color="primary.main">
            Đăng ký trở thành nhà bán hàng
          </H2>
          <Typography variant="subtitle1" color="text.secondary">
            Hãy điền đầy đủ thông tin để chúng tôi có thể tạo tài khoản dành cho
            nhà bán hàng.
          </Typography>
        </Box>

        <Divider sx={{ mb: 4 }} />

        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Stack spacing={2}>
                <TextField
                  label="Họ và tên"
                  name="full_name"
                  variant="outlined"
                  fullWidth
                  value={formik.values.full_name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.full_name && Boolean(formik.errors.full_name)
                  }
                  helperText={
                    formik.touched.full_name && formik.errors.full_name
                  }
                />

                <TextField
                  label="Email"
                  name="email"
                  variant="outlined"
                  fullWidth
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                />

                <TextField
                  label="Số điện thoại"
                  name="phone_number"
                  variant="outlined"
                  fullWidth
                  value={formik.values.phone_number}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.phone_number &&
                    Boolean(formik.errors.phone_number)
                  }
                  helperText={
                    formik.touched.phone_number && formik.errors.phone_number
                  }
                />

                <TextField
                  label="Địa chỉ"
                  name="address"
                  variant="outlined"
                  fullWidth
                  value={formik.values.address}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.address && Boolean(formik.errors.address)
                  }
                  helperText={formik.touched.address && formik.errors.address}
                />

                <TextField
                  label="Tên cửa hàng"
                  name="store_name"
                  variant="outlined"
                  fullWidth
                  value={formik.values.store_name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.store_name &&
                    Boolean(formik.errors.store_name)
                  }
                  helperText={
                    formik.touched.store_name && formik.errors.store_name
                  }
                />
              </Stack>
            </Grid>

            <Grid item xs={12} md={6}>
              <MTDropZone
                title="Kéo & thả hình ảnh banner vào đây"
                imageSize="Chọn ảnh banner kích thước 1024x1024"
                onChange={handleFilesChange}
              />
              {formik.touched.banner && formik.errors.banner && (
                <Typography color="error" mt={1}>
                  {formik.errors.banner}
                </Typography>
              )}
            </Grid>
          </Grid>

          <Box mt={4} textAlign="center">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ px: 4, py: 1.2 }}
            >
              Đăng ký
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default BecomeVendorPage;
