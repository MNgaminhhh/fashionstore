"use client";

import React, { useEffect, useState } from "react";
import {
  Grid,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  CircularProgress,
  Typography,
  Card,
} from "@mui/material";
import { Formik, Form } from "formik";
import * as yup from "yup";
import { useRouter } from "next/navigation";
import Autocomplete from "@mui/material/Autocomplete";
import {
  notifyError,
  notifySuccess,
} from "../../../../utils/ToastNotification";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Coupons from "../../../../services/Coupons";
import CouponModel from "../../../../models/Coupon.model";
import ConditionModel from "../../../../models/Condition.model";

dayjs.extend(customParseFormat);
dayjs.locale("vi");

type Props = {
  coupon?: CouponModel;
  cond?: ConditionModel[];
  token: string;
};

const mappingType: { [key: string]: string } = {
  fixed: "Giá Cố Định",
  percentage: "Phí (%)",
  shipping_fixed: "Phí Vận Chuyển Cố Định",
  shipping_percentage: "Phí Vận Chuyển (%)",
};

const VALIDATION_SCHEMA = yup.object().shape({
  name: yup.string().required("Tên Coupon là bắt buộc"),
  code: yup.string().required("Mã Coupon là bắt buộc"),
  quantity: yup
    .number()
    .required("Số lượng là bắt buộc")
    .min(1, "Số lượng phải ít nhất là 1"),
  start_date: yup
    .string()
    .required("Ngày bắt đầu là bắt buộc")
    .matches(
      /^\d{2}-\d{2}-\d{4}$/,
      "Ngày bắt đầu phải có định dạng DD-MM-YYYY"
    ),
  end_date: yup
    .string()
    .required("Ngày kết thúc là bắt buộc")
    .matches(
      /^\d{2}-\d{2}-\d{4}$/,
      "Ngày kết thúc phải có định dạng DD-MM-YYYY"
    )
    .test(
      "is-after-start",
      "Ngày kết thúc phải sau ngày bắt đầu",
      function (value) {
        const { start_date } = this.parent;
        return dayjs(value, "DD-MM-YYYY").isAfter(
          dayjs(start_date, "DD-MM-YYYY")
        );
      }
    ),
  type: yup
    .string()
    .required("Loại Coupon là bắt buộc")
    .oneOf(
      ["fixed", "percentage", "shipping_fixed", "shipping_percentage"],
      "Loại Coupon không hợp lệ"
    ),
  max_price: yup
    .number()
    .required("Giá tối đa là bắt buộc")
    .min(0, "Giá tối đa không thể âm"),
  discount: yup
    .number()
    .required("Giảm giá là bắt buộc")
    .min(0, "Giảm giá không thể âm")
    .when("type", (type: string, schema: any) => {
      if (type === "percentage" || type === "shipping_percentage") {
        return schema.max(100, "Giảm giá không thể vượt quá 100%");
      }
      return schema;
    }),
  status: yup.boolean().required("Trạng thái là bắt buộc"),
  condition: yup.array().min(1, "Ít nhất một điều kiện phải được chọn"),
});

export default function CouponsDForm({ coupon, cond, token }: Props) {
  console.log(coupon);
  const router = useRouter();
  const [conditionsOptions, setConditionsOptions] = useState(cond || []);
  const [loading, setLoading] = useState<boolean>(false);
  const [initialValues, setInitialValues] = useState<CouponModel>({
    code: "",
    quantity: 1,
    start_date: dayjs().format("DD-MM-YYYY"),
    end_date: dayjs().add(1, "month").format("DD-MM-YYYY"),
    type: "fixed",
    max_price: 0,
    discount: 0,
    status: true,
    name: "",
    condition: [],
  });

  useEffect(() => {
    if (coupon) {
      const mappedConditions = coupon.condition.map((cond) => ({
        ID: cond.condition_id,
        Description: cond.condition_description || "",
      }));
      setInitialValues({
        code: coupon.code || "",
        quantity: coupon.quantity || 1,
        start_date: coupon.startDate || dayjs().format("DD-MM-YYYY"),
        end_date:
          coupon.endDate || dayjs().add(1, "month").format("DD-MM-YYYY"),
        type: coupon.type || "fixed",
        max_price: coupon.max_price || 0,
        discount: coupon.discount || 0,
        status: coupon.status || false,
        name: coupon.name || "",
        condition: mappedConditions || [],
      });
    }
  }, [coupon]);

  const handleFormSubmit = async (values: CouponModel) => {
    try {
      setLoading(true);
      const formattedData = {
        code: values.code,
        quantity: values.quantity,
        start_date: values.start_date,
        end_date: values.end_date,
        type: values.type,
        max_price: values.max_price,
        discount: values.discount,
        status: values.status,
        name: values.name,
        condition: values.condition.map((cond) => ({
          condition_id: cond.condition_id || cond.ID,
        })),
      };

      let response;
      if (coupon && coupon.id) {
        response = await Coupons.update(coupon.id, formattedData, token);
        if (response.data.success) {
          notifySuccess("Cập nhật Coupon thành công!");
        } else {
          throw new Error(response.data.message || "Cập nhật Coupon thất bại.");
        }
      } else {
        response = await Coupons.create(formattedData, token);
        if (response.data.success) {
          notifySuccess("Tạo Coupon mới thành công!");
        } else {
          throw new Error(response.data.message || "Tạo Coupon mới thất bại.");
        }
      }

      router.push("/dashboard/admin/coupons-d");
      router.refresh();
    } catch (error: any) {
      notifyError(error.message || "Có lỗi xảy ra. Vui lòng thử lại sau!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ p: 4, mx: "auto", boxShadow: 3 }}>
      <Typography variant="h5" gutterBottom>
        {coupon ? "Sửa Coupon" : "Tạo Coupon Mới"}
      </Typography>
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={VALIDATION_SCHEMA}
        onSubmit={handleFormSubmit}
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
              <Grid item sm={6} xs={12}>
                <TextField
                  fullWidth
                  name="name"
                  label="Tên Coupon"
                  color="info"
                  size="medium"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  helperText={touched.name && errors.name}
                  error={Boolean(touched.name && errors.name)}
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <TextField
                  fullWidth
                  name="code"
                  label="Mã Coupon"
                  color="info"
                  size="medium"
                  value={values.code}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  helperText={touched.code && errors.code}
                  error={Boolean(touched.code && errors.code)}
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <TextField
                  fullWidth
                  name="quantity"
                  label="Số Lượng"
                  color="info"
                  size="medium"
                  type="number"
                  value={values.quantity}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  helperText={touched.quantity && errors.quantity}
                  error={Boolean(touched.quantity && errors.quantity)}
                  InputProps={{ inputProps: { min: 1 } }}
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <FormControl
                  fullWidth
                  color="info"
                  size="medium"
                  error={Boolean(touched.type && errors.type)}
                >
                  <InputLabel id="type-label">Loại Coupon</InputLabel>
                  <Select
                    labelId="type-label"
                    id="type"
                    name="type"
                    value={values.type}
                    label="Loại Coupon"
                    onChange={handleChange}
                  >
                    <MenuItem value="fixed">Giá Cố Định</MenuItem>
                    <MenuItem value="percentage">Phí (%)</MenuItem>
                    <MenuItem value="shipping_fixed">
                      Phí Vận Chuyển Cố Định
                    </MenuItem>
                    <MenuItem value="shipping_percentage">
                      Phí Vận Chuyển (%)
                    </MenuItem>
                  </Select>
                  {touched.type && errors.type && (
                    <FormHelperText>{errors.type}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item sm={6} xs={12}>
                <TextField
                  fullWidth
                  name="max_price"
                  label="Giá Tối Đa (VNĐ)"
                  color="info"
                  size="medium"
                  type="number"
                  value={values.max_price}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  helperText={touched.max_price && errors.max_price}
                  error={Boolean(touched.max_price && errors.max_price)}
                  InputProps={{ inputProps: { min: 0 } }}
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <TextField
                  fullWidth
                  name="discount"
                  label={
                    values.type === "percentage" ||
                    values.type === "shipping_percentage"
                      ? "Giảm Giá (%)"
                      : "Giảm Giá (VNĐ)"
                  }
                  color="info"
                  size="medium"
                  type="number"
                  value={values.discount}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  helperText={touched.discount && errors.discount}
                  error={Boolean(touched.discount && errors.discount)}
                  InputProps={{
                    inputProps:
                      values.type === "percentage" ||
                      values.type === "shipping_percentage"
                        ? { min: 0, max: 100 }
                        : { min: 0 },
                    endAdornment:
                      values.type === "percentage" ||
                      values.type === "shipping_percentage" ? (
                        <Typography variant="body2">%</Typography>
                      ) : (
                        <Typography variant="body2">VNĐ</Typography>
                      ),
                  }}
                />
              </Grid>
              <Grid item sm={12} xs={12}>
                <Autocomplete
                  multiple
                  id="condition"
                  options={conditionsOptions}
                  getOptionLabel={(option) =>
                    option.condition_description || option.Description
                  }
                  value={values.condition}
                  onChange={(event, newValue) => {
                    setFieldValue("condition", newValue);
                  }}
                  renderOption={(props, option, { selected }) => (
                    <li {...props}>
                      {option.condition_description || option.Description}
                    </li>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Điều Kiện"
                      placeholder="Chọn điều kiện"
                      error={Boolean(touched.condition && errors.condition)}
                      helperText={
                        touched.condition && errors.condition
                          ? (errors.condition as string)
                          : ""
                      }
                    />
                  )}
                />
                {touched.condition && typeof errors.condition === "string" && (
                  <Typography variant="caption" color="error">
                    {errors.condition}
                  </Typography>
                )}
              </Grid>
              <Grid item sm={6} xs={12}>
                <DatePicker
                  label="Ngày Bắt Đầu"
                  inputFormat="DD/MM/YYYY"
                  value={dayjs(values.start_date, "DD-MM-YYYY")}
                  onChange={(date) => {
                    if (date && date.isValid()) {
                      const formattedDate = date.format("DD-MM-YYYY");
                      setFieldValue("start_date", formattedDate);
                    } else {
                      setFieldValue("start_date", "");
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      name="start_date"
                      onBlur={handleBlur}
                      helperText={touched.start_date && errors.start_date}
                      error={Boolean(touched.start_date && errors.start_date)}
                    />
                  )}
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <DatePicker
                  label="Ngày Kết Thúc"
                  inputFormat="DD/MM/YYYY"
                  value={dayjs(values.end_date, "DD-MM-YYYY")}
                  onChange={(date) => {
                    if (date && date.isValid()) {
                      const formattedDate = date.format("DD-MM-YYYY");
                      setFieldValue("end_date", formattedDate);
                    } else {
                      setFieldValue("end_date", "");
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      name="end_date"
                      onBlur={handleBlur}
                      helperText={touched.end_date && errors.end_date}
                      error={Boolean(touched.end_date && errors.end_date)}
                    />
                  )}
                />
              </Grid>
              <Grid item sm={12} xs={12}>
                <FormControl
                  fullWidth
                  color="info"
                  size="medium"
                  error={Boolean(touched.status && errors.status)}
                >
                  <InputLabel id="status-label">Trạng Thái</InputLabel>
                  <Select
                    labelId="status-label"
                    id="status"
                    name="status"
                    value={values.status}
                    label="Trạng Thái"
                    onChange={(e) => {
                      setFieldValue("status", e.target.value === true);
                    }}
                  >
                    <MenuItem value={true}>Hoạt động</MenuItem>
                    <MenuItem value={false}>Không hoạt động</MenuItem>
                  </Select>
                  {touched.status && errors.status && (
                    <FormHelperText>{errors.status}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
            </Grid>

            <Grid container spacing={3} sx={{ mt: 2 }}>
              <Grid item xs={12} textAlign="center">
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => router.push("/dashboard/admin/coupons-d")}
                  sx={{ px: 4, py: 1, mr: 2, textTransform: "none" }}
                >
                  Hủy Bỏ
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={loading}
                  sx={{ px: 4, py: 1, textTransform: "none" }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : coupon ? (
                    "Lưu Thay Đổi"
                  ) : (
                    "Tạo Coupon"
                  )}
                </Button>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </Card>
  );
}
