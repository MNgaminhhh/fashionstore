"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import { Formik } from "formik";
import * as yup from "yup";
import { FlexBox } from "../../../../components/flexbox";
import { StyledClear, UploadImageBox } from "../../../styles";
import MTDropZone from "../../../../components/MTDropZone";
import VendorModel from "../../../../models/Vendor.model";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";

const VALIDATION_SCHEMA = yup.object().shape({
  store_name: yup.string().required("Tên cửa hàng là bắt buộc"),
  full_name: yup.string().required("Họ và tên là bắt buộc"),
  phone_number: yup.string().required("Số điện thoại là bắt buộc"),
  description: yup.string().required("Mô tả là bắt buộc"),
  status: yup.string().required("Trạng thái là bắt buộc"),
});

type Props = { vendor: VendorModel };

export default function VendorForm({ vendor }: Props) {
  const [files, setFiles] = useState([]);

  const INITIAL_VALUES = {
    store_name: "",
    full_name: "",
    phone_number: "",
    description: "",
    status: "active",
  };

  const handleFormSubmit = () => {};

  const handleChangeDropZone = (files: File[]) => {
    files.forEach((file) =>
      Object.assign(file, { preview: URL.createObjectURL(file) })
    );
    setFiles(files);
  };

  const handleFileDelete = (file: File) => () => {
    setFiles((files) => files.filter((item) => item.name !== file.name));
  };

  return (
    <Card sx={{ p: 4, mx: "auto", boxShadow: 3 }}>
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={INITIAL_VALUES}
        validationSchema={VALIDATION_SCHEMA}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
            <Typography variant="h5" mb={2} textAlign="center">
              Thông tin cửa hàng
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={3}>
              <Grid item sm={6} xs={12}>
                <TextField
                  fullWidth
                  name="store_name"
                  label="Tên cửa hàng"
                  color="info"
                  size="medium"
                  value={values.store_name}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  helperText={touched.store_name && errors.store_name}
                  error={Boolean(touched.store_name && errors.store_name)}
                />
              </Grid>

              <Grid item sm={6} xs={12}>
                <TextField
                  fullWidth
                  name="full_name"
                  label="Họ và tên"
                  color="info"
                  size="medium"
                  value={values.full_name}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  helperText={touched.full_name && errors.full_name}
                  error={Boolean(touched.full_name && errors.full_name)}
                />
              </Grid>

              <Grid item sm={6} xs={12}>
                <TextField
                  fullWidth
                  name="phone_number"
                  label="Số điện thoại"
                  color="info"
                  size="medium"
                  value={values.phone_number}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  helperText={touched.phone_number && errors.phone_number}
                  error={Boolean(touched.phone_number && errors.phone_number)}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  name="description"
                  label="Mô tả"
                  color="info"
                  size="medium"
                  value={values.description}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  helperText={touched.description && errors.description}
                  error={Boolean(touched.description && errors.description)}
                />
              </Grid>

              <Grid item sm={6} xs={12}>
                <TextField
                  select
                  fullWidth
                  color="info"
                  size="medium"
                  name="status"
                  value={values.status}
                  onChange={handleChange}
                  label="Trạng thái"
                >
                  <MenuItem value="active">Hoạt động</MenuItem>
                  <MenuItem value="rejected">Bị từ chối</MenuItem>
                  <MenuItem value="pending">Đang chờ duyệt</MenuItem>
                  <MenuItem value="">Không xác định</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <MTDropZone
                  title="Kéo và thả hình ảnh cửa hàng"
                  onChange={(files) => handleChangeDropZone(files)}
                />
                <FlexBox flexDirection="row" mt={2} flexWrap="wrap" gap={1}>
                  {files.map((file, index) => (
                    <UploadImageBox
                      key={index}
                      sx={{
                        width: 300,
                        height: 300,
                        position: "relative",
                        borderRadius: 2,
                        overflow: "hidden",
                        boxShadow: 1,
                      }}
                    >
                      <Box
                        component="img"
                        alt="Hình ảnh cửa hàng"
                        src={file.preview}
                        sx={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                      <StyledClear onClick={handleFileDelete(file)} />
                    </UploadImageBox>
                  ))}
                </FlexBox>
              </Grid>

              <Grid item xs={12} mt={3} textAlign="center">
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  sx={{ px: 4, py: 1 }}
                >
                  Lưu thông tin
                </Button>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </Card>
  );
}
