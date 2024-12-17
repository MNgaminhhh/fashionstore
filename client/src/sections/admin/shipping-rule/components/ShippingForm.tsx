"use client";

import { ReactNode, useState } from "react";
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
  SelectChangeEvent,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import ShippingRuleModel from "../../../../models/ShippingRule.model";
import {
  notifyError,
  notifySuccess,
} from "../../../../utils/ToastNotification";
import ShippingRule from "../../../../services/ShippingRule";

const VALIDATION_SCHEMA = yup.object().shape({
  name: yup.string().required("Tên là bắt buộc"),
  minOrderCost: yup
    .number()
    .required("Giá trị đơn hàng tối thiểu là bắt buộc")
    .min(0, "Giá trị đơn hàng tối thiểu phải lớn hơn hoặc bằng 0"),
  price: yup
    .number()
    .required("Giá vận chuyển là bắt buộc")
    .min(0, "Giá vận chuyển phải lớn hơn hoặc bằng 0"),
  status: yup
    .string()
    .required("Trạng thái là bắt buộc")
    .oneOf(["true", "false"], "Trạng thái không hợp lệ"),
});

type Props = {
  shippingRule?: ShippingRuleModel;
  token: string;
};

export default function ShippingRuleForm({ shippingRule, token }: Props) {
  const router = useRouter();
  const [isFormChanged, setIsFormChanged] = useState(false);
  const [uploading, setUploading] = useState(false);

  const INITIAL_VALUES = {
    name: shippingRule ? shippingRule.name : "",
    minOrderCost: shippingRule ? shippingRule.min_order_cost.toString() : "",
    price: shippingRule ? shippingRule.price.toString() : "",
    status: shippingRule ? (shippingRule.status ? "true" : "false") : "true",
  };

  const handleFormSubmit = async (values: typeof INITIAL_VALUES) => {
    try {
      setUploading(true);

      const formattedData = {
        name: values.name,
        minOrderCost: parseFloat(values.minOrderCost),
        price: parseFloat(values.price),
        status: values.status === "true",
      };

      let response;
      if (shippingRule) {
        response = await ShippingRule.update(
          shippingRule.id,
          formattedData,
          token
        );
      } else {
        response = await ShippingRule.create(formattedData, token);
      }

      if (response?.data?.success) {
        notifySuccess(
          shippingRule
            ? "Cập nhật Shipping Rule thành công!"
            : "Tạo Shipping Rule mới thành công!"
        );
        router.push("/dashboard/admin/shipping-rule");
        router.refresh();
      } else {
        notifyError(
          `${
            shippingRule
              ? "Cập nhật Shipping Rule thất bại: "
              : "Tạo Shipping Rule thất bại: "
          }${response.data.message || response.message}`
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
                <TextField
                  fullWidth
                  name="name"
                  label="Tên"
                  color="info"
                  size="medium"
                  value={values.name}
                  onBlur={handleBlur}
                  onChange={handleFieldChange(handleChange, setFieldValue)}
                  helperText={touched.name && errors.name}
                  error={Boolean(touched.name && errors.name)}
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <TextField
                  fullWidth
                  name="minOrderCost"
                  label="Giá Trị Đơn Hàng Tối Thiểu"
                  color="info"
                  size="medium"
                  type="number"
                  value={values.minOrderCost}
                  onBlur={handleBlur}
                  onChange={handleFieldChange(handleChange, setFieldValue)}
                  helperText={touched.minOrderCost && errors.minOrderCost}
                  error={Boolean(touched.minOrderCost && errors.minOrderCost)}
                  InputProps={{
                    inputProps: { min: 0 },
                  }}
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <TextField
                  fullWidth
                  name="price"
                  label="Giá Vận Chuyển"
                  color="info"
                  size="medium"
                  type="number"
                  value={values.price}
                  onBlur={handleBlur}
                  onChange={handleFieldChange(handleChange, setFieldValue)}
                  helperText={touched.price && errors.price}
                  error={Boolean(touched.price && errors.price)}
                  InputProps={{
                    inputProps: { min: 0 },
                  }}
                />
              </Grid>
              <Grid item sm={6} xs={12}>
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
                    onChange={(
                      event: SelectChangeEvent<string>,
                      child: ReactNode
                    ) => {
                      const syntheticEvent = {
                        target: {
                          name: event.target.name,
                          value: event.target.value,
                        },
                      } as React.ChangeEvent<
                        | HTMLInputElement
                        | HTMLTextAreaElement
                        | { name?: string; value: unknown }
                      >;

                      handleFieldChange(
                        handleChange,
                        setFieldValue
                      )(syntheticEvent);
                    }}
                  >
                    <MenuItem value="true">Hiển thị</MenuItem>
                    <MenuItem value="false">Ẩn</MenuItem>
                  </Select>
                  {touched.status && errors.status && (
                    <FormHelperText>{errors.status}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} mt={3} textAlign="center">
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => router.push("/dashboard/admin/shipping-rule")}
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
                  {uploading
                    ? "Đang xử lý..."
                    : shippingRule
                    ? "Lưu thông tin"
                    : "Tạo Shipping Rule"}
                </Button>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </Card>
  );
}
