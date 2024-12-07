"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  Grid,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  CircularProgress,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import {
  notifyError,
  notifySuccess,
} from "../../../../utils/ToastNotification";
import Conditions from "../../../../services/Conditions";
import CouponModel from "../../../../models/Coupon.model";

const VALIDATION_SCHEMA = yup.object().shape({
  field: yup
    .string()
    .required("Kiểu là bắt buộc")
    .oneOf(["shipping_cost", "price", "product_type"], "Kiểu không hợp lệ"),
  operator: yup
    .string()
    .required("Toán Tử là bắt buộc")
    .oneOf([">=", ">", "="], "Toán Tử không hợp lệ"),
  value: yup.string().required("Giá trị là bắt buộc"),
  description: yup.string().required("Mô tả là bắt buộc"),
});

type Props = {
  coupon?: CouponModel;
  token: string;
};

export default function CouponsForm({ coupon, token }: Props) {
  const router = useRouter();
  const [isFormChanged, setIsFormChanged] = useState(false);
  const [uploading, setUploading] = useState(false);
  const INITIAL_VALUES = {
    field: coupon ? coupon.Field : "",
    operator: coupon ? coupon.Operator : "",
    value: coupon ? coupon.Value?.value : "",
    description: coupon ? coupon.Description : "",
  };

  const handleFormSubmit = async (values: typeof INITIAL_VALUES) => {
    try {
      setUploading(true);

      const formattedData = {
        field: values.field,
        operator: values.operator,
        value: String(values.value),
        description: values.description,
      };

      let response;
      if (coupon) {
        response = await Conditions.update(coupon.ID, formattedData, token);
      } else {
        response = await Conditions.create(formattedData, token);
      }

      if (response?.success || response?.data?.success) {
        notifySuccess(
          coupon ? "Cập nhật Coupon thành công!" : "Tạo Coupon mới thành công!"
        );
        router.push("/dashboard/admin/coupons");
        router.refresh();
      } else {
        notifyError(
          `${coupon ? "Cập nhật Coupon thất bại: " : "Tạo Coupon thất bại: "}${
            response.data?.message || response.message || "Vui lòng thử lại."
          }`
        );
      }

      setIsFormChanged(false);
    } catch (error: any) {
      notifyError(error.message || "Có lỗi xảy ra. Vui lòng thử lại sau!");
    } finally {
      setUploading(false);
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
      const { name, value } = event.target;
      if (name) {
        setFieldValue(name, value);
        setIsFormChanged(true);
      }
      handleChange(event);
    };

  return (
    <Card sx={{ p: 4, mx: "auto", boxShadow: 3 }}>
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={INITIAL_VALUES}
        validationSchema={VALIDATION_SCHEMA}
        enableReinitialize
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          setFieldValue,
        }) => (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item sm={6} xs={12}>
                <FormControl
                  fullWidth
                  color="info"
                  size="medium"
                  error={Boolean(touched.field && errors.field)}
                >
                  <InputLabel id="field-label">Kiểu</InputLabel>
                  <Select
                    labelId="field-label"
                    id="field"
                    name="field"
                    value={values.field}
                    label="Kiểu"
                    onChange={handleFieldChange(handleChange, setFieldValue)}
                  >
                    {/* <MenuItem value="shipping_cost">Phí vận chuyển</MenuItem> */}
                    <MenuItem value="price">Giá trị đơn hàng</MenuItem>
                  </Select>
                  {touched.field && errors.field && (
                    <FormHelperText>{errors.field}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item sm={6} xs={12}>
                <FormControl
                  fullWidth
                  color="info"
                  size="medium"
                  error={Boolean(touched.operator && errors.operator)}
                >
                  <InputLabel id="operator-label">Toán Tử</InputLabel>
                  <Select
                    labelId="operator-label"
                    id="operator"
                    name="operator"
                    value={values.operator}
                    label="Toán Tử"
                    onChange={handleFieldChange(handleChange, setFieldValue)}
                  >
                    <MenuItem value=">=">&gt;=</MenuItem>
                    <MenuItem value=">">&gt;</MenuItem>
                    <MenuItem value="=">=</MenuItem>
                  </Select>
                  {touched.operator && errors.operator && (
                    <FormHelperText>{errors.operator}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item sm={6} xs={12}>
                <TextField
                  fullWidth
                  name="value"
                  label="Giá Trị"
                  color="info"
                  size="medium"
                  type="number"
                  value={values.value}
                  onBlur={handleBlur}
                  onChange={handleFieldChange(handleChange, setFieldValue)}
                  helperText={touched.value && errors.value}
                  error={Boolean(touched.value && errors.value)}
                  InputProps={{
                    inputProps: { min: 0 },
                  }}
                />
              </Grid>

              <Grid item sm={6} xs={12}>
                <TextField
                  fullWidth
                  name="description"
                  label="Mô Tả"
                  color="info"
                  size="medium"
                  value={values.description}
                  onBlur={handleBlur}
                  onChange={handleFieldChange(handleChange, setFieldValue)}
                  helperText={touched.description && errors.description}
                  error={Boolean(touched.description && errors.description)}
                />
              </Grid>
              <Grid item xs={12} mt={3} textAlign="center">
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => router.push("/dashboard/admin/coupons")}
                  sx={{ px: 4, py: 1, mr: 2, textTransform: "none" }}
                >
                  Trở về
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={!isFormChanged || uploading}
                  sx={{ px: 4, py: 1, textTransform: "none" }}
                >
                  {uploading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : coupon ? (
                    "Lưu thông tin"
                  ) : (
                    "Tạo Coupon"
                  )}
                </Button>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </Card>
  );
}
