"use client";

import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  TextField,
  Button,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CircularProgress,
  Slider,
  Grid,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import SkuModel from "../../../../models/Sku.model"; // Đường dẫn tùy chỉnh
import {
  notifyError,
  notifySuccess,
} from "../../../../utils/ToastNotification";
import Skus from "../../../../services/Skus"; // Giả sử bạn có dịch vụ Skus

type VariantOption = {
  id: string;
  name: string;
};

type Props = {
  sku?: SkuModel;
  variOp: VariantOption[]; // Danh sách các biến thể có thể chọn
  token: string;
};

const SkuSchema = Yup.object().shape({
  sku: Yup.string().required("Mã sản phẩm là bắt buộc"),
  price: Yup.number()
    .typeError("Giá phải là một số")
    .positive("Giá phải lớn hơn 0")
    .required("Giá là bắt buộc"),
  in_stock: Yup.string().required("Số lượng là bắt buộc"),
  variant_options: Yup.array()
    .of(Yup.string())
    .min(1, "Bạn phải chọn ít nhất một biến thể")
    .required("Biến thể là bắt buộc"),
  offer: Yup.number()
    .min(0, "Giảm giá phải từ 0%")
    .max(100, "Giảm giá không được vượt quá 100%")
    .required("Giảm giá là bắt buộc"),
  offer_start_date: Yup.date().when("offer", {
    is: (offer: number) => offer > 0,
    then: Yup.date()
      .required("Ngày bắt đầu khuyến mãi là bắt buộc")
      .typeError("Ngày bắt đầu khuyến mãi không hợp lệ"),
    otherwise: Yup.date().notRequired(),
  }),
  offer_end_date: Yup.date().when("offer", {
    is: (offer: number) => offer > 0,
    then: Yup.date()
      .required("Ngày kết thúc khuyến mãi là bắt buộc")
      .typeError("Ngày kết thúc khuyến mãi không hợp lệ")
      .min(Yup.ref("offer_start_date"), "Ngày kết thúc phải sau ngày bắt đầu"),
    otherwise: Yup.date().notRequired(),
  }),
});

const INITIAL_VALUES = (sku?: SkuModel) => ({
  sku: sku?.sku || "",
  price: sku?.price || 0,
  in_stock: sku?.in_stock || "",
  variant_options: sku?.variant_options || [],
  offer: sku?.offer || 0,
  offer_start_date: sku?.offer_start_date
    ? sku.offer_start_date.toISOString().slice(0, 16)
    : "",
  offer_end_date: sku?.offer_end_date
    ? sku.offer_end_date.toISOString().slice(0, 16)
    : "",
});

export default function SkuForm({ sku, variOp, token }: Props) {
  const router = useRouter();
  const params = useParams();
  const { productId, variantId, skuId } = params;
  const [isFormChanged, setIsFormChanged] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (
    values: typeof INITIAL_VALUES,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    setLoading(true);
    try {
      const skuData: Partial<SkuModel> = {
        sku: values.sku,
        price: values.price,
        in_stock: values.in_stock,
        offer: values.offer,
        variant_options: values.variant_options,
        offer_start_date:
          values.offer > 0 ? new Date(values.offer_start_date) : undefined,
        offer_end_date:
          values.offer > 0 ? new Date(values.offer_end_date) : undefined,
        product_id: productId as string,
      };

      let response;

      if (sku) {
        response = await Skus.update(sku.id, skuData, token, true);
        if (response.data.success) {
          notifySuccess("Cập nhật SKU thành công!");
        } else {
          notifyError(
            "Cập nhật SKU thất bại: " +
              (response.data.message || "Vui lòng thử lại.")
          );
          return;
        }
      } else {
        response = await Skus.create(skuData, token, true);
        if (response.data.success) {
          notifySuccess("Tạo mới SKU thành công!");
        } else {
          notifyError(
            "Tạo mới SKU thất bại: " +
              (response.data.message || "Vui lòng thử lại!")
          );
          return;
        }
      }

      // Điều hướng sau khi thành công
      router.push(
        `/dashboard/vendor/product/${productId}/variant/${variantId}/skus`
      );
      router.refresh();
    } catch (error: any) {
      console.error("Error:", error);
      notifyError("Có lỗi xảy ra khi gửi dữ liệu.");
    } finally {
      setSubmitting(false);
      setLoading(false);
      setIsFormChanged(false);
    }
  };

  const handleFieldChange =
    (handleChange: any, setFieldValue: any) =>
    (
      event: React.ChangeEvent<
        | HTMLInputElement
        | HTMLTextAreaElement
        | { name?: string; value: unknown }
      >
    ) => {
      const { name, value } = event.target as HTMLInputElement;

      if (name) {
        setFieldValue(name, value);
        setIsFormChanged(true);
      }

      handleChange(event);
    };

  return (
    <Card sx={{ p: 4, mx: "auto", maxWidth: 800, boxShadow: 3 }}>
      <Formik
        initialValues={INITIAL_VALUES(sku)}
        validationSchema={SkuSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          setFieldValue,
          isSubmitting,
        }) => (
          <Form>
            <Grid container spacing={3}>
              {/* Mã SKU */}
              <Grid item sm={6} xs={12}>
                <TextField
                  fullWidth
                  name="sku"
                  label="Mã SKU"
                  color="info"
                  size="medium"
                  value={values.sku}
                  onBlur={handleBlur}
                  onChange={handleFieldChange(handleChange, setFieldValue)}
                  helperText={touched.sku && errors.sku}
                  error={Boolean(touched.sku && errors.sku)}
                  disabled={loading}
                />
              </Grid>

              {/* Giá */}
              <Grid item sm={6} xs={12}>
                <TextField
                  fullWidth
                  name="price"
                  label="Giá"
                  type="number"
                  color="info"
                  size="medium"
                  value={values.price}
                  onBlur={handleBlur}
                  onChange={handleFieldChange(handleChange, setFieldValue)}
                  helperText={touched.price && errors.price}
                  error={Boolean(touched.price && errors.price)}
                  disabled={loading}
                  inputProps={{ min: 0, step: 0.01 }}
                />
              </Grid>

              {/* Số Lượng */}
              <Grid item sm={6} xs={12}>
                <TextField
                  fullWidth
                  name="in_stock"
                  label="Số Lượng"
                  type="number"
                  color="info"
                  size="medium"
                  value={values.in_stock}
                  onBlur={handleBlur}
                  onChange={handleFieldChange(handleChange, setFieldValue)}
                  helperText={touched.in_stock && errors.in_stock}
                  error={Boolean(touched.in_stock && errors.in_stock)}
                  disabled={loading}
                  inputProps={{ min: 0, step: 1 }}
                />
              </Grid>

              {/* Chọn Biến Thể (Autocomplete) */}
              <Grid item sm={6} xs={12}>
                <Autocomplete
                  multiple
                  options={variOp}
                  getOptionLabel={(option) => option.name}
                  value={variOp.filter((option) =>
                    values.variant_options.includes(option.id)
                  )}
                  onChange={(event, newValue) => {
                    const selectedIds = newValue.map((option) => option.id);
                    setFieldValue("variant_options", selectedIds);
                    setIsFormChanged(true);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Biến Thể"
                      placeholder="Chọn biến thể"
                      error={Boolean(
                        touched.variant_options && errors.variant_options
                      )}
                      helperText={
                        touched.variant_options && errors.variant_options
                      }
                      disabled={loading}
                    />
                  )}
                />
              </Grid>

              {/* Giảm giá (Slider) */}
              <Grid item sm={6} xs={12}>
                <Typography gutterBottom>Giảm giá: {values.offer}%</Typography>
                <Slider
                  value={values.offer}
                  onChange={(event, newValue) => {
                    setFieldValue("offer", newValue);
                    setIsFormChanged(true);
                  }}
                  aria-labelledby="offer-slider"
                  valueLabelDisplay="auto"
                  step={1}
                  marks
                  min={0}
                  max={100}
                  disabled={loading}
                />
                {touched.offer && errors.offer && (
                  <Typography color="error" variant="caption">
                    {errors.offer}
                  </Typography>
                )}
              </Grid>

              {/* Ngày bắt đầu khuyến mãi */}
              {values.offer > 0 && (
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
                    onChange={handleFieldChange(handleChange, setFieldValue)}
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
              )}

              {/* Ngày kết thúc khuyến mãi */}
              {values.offer > 0 && (
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
                    onChange={handleFieldChange(handleChange, setFieldValue)}
                    helperText={touched.offer_end_date && errors.offer_end_date}
                    error={Boolean(
                      touched.offer_end_date && errors.offer_end_date
                    )}
                    disabled={loading}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
              )}
            </Grid>

            {/* Nút Trở về và Nút Gửi */}
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
                  router.push(
                    `/dashboard/vendor/product/${productId}/variant/${variantId}/skus`
                  )
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
                ) : sku ? (
                  "Cập Nhật"
                ) : (
                  "Thêm Mới"
                )}
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Card>
  );
}
