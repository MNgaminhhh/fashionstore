"use client";
import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  TextField,
  Button,
  Box,
  Card,
  MenuItem,
  Typography,
  Divider,
  Grid,
  Paper,
  CircularProgress,
} from "@mui/material";
import SkuModel from "../../../../models/Sku.model";
import { useParams, useRouter } from "next/navigation";

type SkuData = {
  id: string;
  product_name: string;
  product_id: string;
  sku: string;
  price: number;
  offer_price: number;
  offer: number;
  variants: { [key: string]: string };
  in_stock: number;
};

type SkuModelUpdate = {
  sku: string;
  price: number;
  offer: number;
  in_stock: number;
  status: string;
  offer_start_date?: Date;
  offer_end_date?: Date;
};

const SkuSchema = Yup.object().shape({
  sku: Yup.string().required("Mã SKU là bắt buộc"),
  price: Yup.number()
    .positive("Giá phải lớn hơn 0")
    .required("Giá là bắt buộc"),
  offer: Yup.number()
    .min(0, "Giảm giá phải từ 0%")
    .max(100, "Giảm giá không được vượt quá 100%")
    .required("Giảm giá là bắt buộc"),
  in_stock: Yup.number()
    .min(0, "Số lượng phải >=0")
    .required("Số lượng bắt buộc"),
  status: Yup.string()
    .oneOf(["active", "inactive"], "Trạng thái không hợp lệ")
    .required("Trạng thái là bắt buộc"),
  offer_start_date: Yup.string().when("offer", {
    is: (offer: number) => offer > 0,
    then: (schema) => schema.required("Ngày bắt đầu khuyến mãi là bắt buộc"),
    otherwise: (schema) => schema.notRequired(),
  }),
  offer_end_date: Yup.string().when("offer", {
    is: (offer: number) => offer > 0,
    then: (schema) => schema.required("Ngày kết thúc khuyến mãi là bắt buộc"),
    otherwise: (schema) => schema.notRequired(),
  }),
});

// Giả lập SkuUpdate API call
async function SkuUpdate(id: string, data: SkuModelUpdate) {
  // Call API thực tế ở đây
  // return await fetch(...);
  return { success: true };
}

export default function SkuEditForm({
  initialData,
}: {
  initialData: SkuModel;
}) {
  const [loading, setLoading] = useState(false);
  const [isFormChanged, setIsFormChanged] = useState(false);
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const productId = Array.isArray(id) ? id[0] : id;

  const formatDateTimeLocal = (date?: string | Date): string => {
    if (!date) return "";
    const d = typeof date === "string" ? new Date(date) : date;
    if (isNaN(d.getTime())) return "";
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const initialValues = {
    sku: initialData.sku || "",
    price: initialData.price || 0,
    offer: initialData.offer || 0,
    in_stock: initialData.in_stock || 0,
    status: "active",
    // Giả sử initialData chưa có offer_start_date và offer_end_date, để trống.
    // Nếu có, formatDateTimeLocal(initialData.offer_start_date)
    offer_start_date: "",
    offer_end_date: "",
  };

  const handleSubmit = async (values: typeof initialValues) => {
    setLoading(true);
    try {
      let startDate: Date | undefined;
      let endDate: Date | undefined;

      if (values.offer > 0) {
        if (values.offer_start_date) {
          startDate = new Date(values.offer_start_date);
        }
        if (values.offer_end_date) {
          endDate = new Date(values.offer_end_date);
        }

        if (
          !startDate ||
          !endDate ||
          isNaN(startDate.getTime()) ||
          isNaN(endDate.getTime())
        ) {
          alert("Ngày khuyến mãi không hợp lệ!");
          setLoading(false);
          return;
        }
      }

      const payload: SkuModelUpdate = {
        sku: values.sku,
        price: values.price,
        offer: values.offer,
        in_stock: values.in_stock,
        status: values.status,
        offer_start_date: values.offer > 0 ? startDate : undefined,
        offer_end_date: values.offer > 0 ? endDate : undefined,
      };

      const res = await SkuUpdate(initialData.id, payload);
      if (res.success) {
        alert("Cập nhật SKU thành công!");
      } else {
        alert("Cập nhật SKU thất bại!");
      }
    } catch (error) {
      console.error(error);
      alert("Có lỗi xảy ra khi cập nhật SKU");
    } finally {
      setLoading(false);
      setIsFormChanged(false);
    }
  };

  return (
    <Card sx={{ p: 4, mx: "auto", boxShadow: 3 }}>
      {initialData.variants && Object.keys(initialData.variants).length > 0 && (
        <Paper
          elevation={2}
          sx={{ p: 2, mb: 3, backgroundColor: "#f9f9f9", borderRadius: 2 }}
        >
          <Typography variant="subtitle1" mb={1}>
            Các biến thể:
          </Typography>
          {Object.entries(initialData.variants).map(([key, value]) => (
            <Box key={key} display="flex" alignItems="center" mb={1}>
              <Typography variant="body2" sx={{ fontWeight: "bold", mr: 1 }}>
                {key}:
              </Typography>
              <Typography variant="body2">{value}</Typography>
            </Box>
          ))}
        </Paper>
      )}

      <Formik
        initialValues={initialValues}
        validationSchema={SkuSchema}
        onSubmit={handleSubmit}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          isSubmitting,
        }) => (
          <Form>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="sku"
                  label="Mã SKU"
                  value={values.sku}
                  onBlur={handleBlur}
                  onChange={(e) => {
                    handleChange(e);
                    setIsFormChanged(true);
                  }}
                  helperText={touched.sku && errors.sku}
                  error={Boolean(touched.sku && errors.sku)}
                  disabled={loading}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="price"
                  label="Giá"
                  type="number"
                  value={values.price}
                  onBlur={handleBlur}
                  onChange={(e) => {
                    handleChange(e);
                    setIsFormChanged(true);
                  }}
                  helperText={touched.price && errors.price}
                  error={Boolean(touched.price && errors.price)}
                  disabled={loading}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="offer"
                  label="Giảm giá (%)"
                  type="number"
                  value={values.offer}
                  onBlur={handleBlur}
                  onChange={(e) => {
                    handleChange(e);
                    setIsFormChanged(true);
                  }}
                  helperText={touched.offer && errors.offer}
                  error={Boolean(touched.offer && errors.offer)}
                  disabled={loading}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="in_stock"
                  label="Số lượng trong kho"
                  type="number"
                  value={values.in_stock}
                  onBlur={handleBlur}
                  onChange={(e) => {
                    handleChange(e);
                    setIsFormChanged(true);
                  }}
                  helperText={touched.in_stock && errors.in_stock}
                  error={Boolean(touched.in_stock && errors.in_stock)}
                  disabled={loading}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  select
                  fullWidth
                  name="status"
                  label="Trạng thái"
                  value={values.status}
                  onBlur={handleBlur}
                  onChange={(e) => {
                    handleChange(e);
                    setIsFormChanged(true);
                  }}
                  helperText={touched.status && errors.status}
                  error={Boolean(touched.status && errors.status)}
                  disabled={loading}
                >
                  <MenuItem value="active">Hiển Thị</MenuItem>
                  <MenuItem value="inactive">Ẩn</MenuItem>
                </TextField>
              </Grid>

              {values.offer > 0 && (
                <>
                  <Grid item sm={6} xs={12}>
                    <TextField
                      fullWidth
                      name="offer_start_date"
                      label="Ngày Bắt Đầu Khuyến Mãi"
                      type="datetime-local"
                      color="info"
                      size="medium"
                      value={values.offer_start_date}
                      onBlur={handleBlur}
                      onChange={(e) => {
                        handleChange(e);
                        setIsFormChanged(true);
                      }}
                      helperText={
                        touched.offer_start_date && errors.offer_start_date
                      }
                      error={Boolean(
                        touched.offer_start_date && errors.offer_start_date
                      )}
                      disabled={loading}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>

                  <Grid item sm={6} xs={12}>
                    <TextField
                      fullWidth
                      name="offer_end_date"
                      label="Ngày Kết Thúc Khuyến Mãi"
                      type="datetime-local"
                      color="info"
                      size="medium"
                      value={values.offer_end_date}
                      onBlur={handleBlur}
                      onChange={(e) => {
                        handleChange(e);
                        setIsFormChanged(true);
                      }}
                      helperText={
                        touched.offer_end_date && errors.offer_end_date
                      }
                      error={Boolean(
                        touched.offer_end_date && errors.offer_end_date
                      )}
                      disabled={loading}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                </>
              )}
            </Grid>

            <Box
              display="flex"
              justifyContent="flex-end"
              mt={4}
              alignItems="center"
            >
              <Button
                variant="outlined"
                color="secondary"
                onClick={() =>
                  router.push(`/dashboard/vendor/product/${productId}/sku`)
                }
                sx={{ px: 4, py: 1, mr: 2, textTransform: "none" }}
                disabled={loading}
              >
                Trở về
              </Button>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={!isFormChanged || isSubmitting || loading}
                sx={{ px: 4, py: 1, textTransform: "none" }}
              >
                {loading ? (
                  <>
                    <CircularProgress
                      size={24}
                      color="inherit"
                      sx={{ mr: 1 }}
                    />
                    Đang tải...
                  </>
                ) : (
                  "Cập Nhật"
                )}
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Card>
  );
}
