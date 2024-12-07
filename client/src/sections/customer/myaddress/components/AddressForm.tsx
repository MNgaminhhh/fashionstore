import React from "react";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Formik } from "formik";
import * as yup from "yup";
import AddressModel from "../../../../models/Address.model";
import Address from "../../../../services/Address";
import { useRouter } from "next/navigation";
import {
  notifyError,
  notifySuccess,
} from "../../../../utils/ToastNotification";
import { useAppContext } from "../../../../context/AppContext";

type Props = { address?: AddressModel };

export default function AddressForm({ address }: Props) {
  const router = useRouter();
  const { sessionToken } = useAppContext();
  const INITIAL_VALUES = {
    receiver_name: address?.receiver_name || "",
    address: address?.address || "",
    email: address?.email || "",
    phone_number: address?.phone_number || "",
  };

  const VALIDATION_SCHEMA = yup.object().shape({
    receiver_name: yup.string().required("Tên người nhận là bắt buộc"),
    address: yup.string().required("Địa chỉ là bắt buộc"),
    email: yup
      .string()
      .email("Email không hợp lệ")
      .required("Email là bắt buộc"),
    phone_number: yup
      .string()
      .matches(/^\d{10}$/, "Số điện thoại phải có chính xác 10 số")
      .required("Số điện thoại là bắt buộc"),
  });

  const handleSubmit = async (
    values: typeof INITIAL_VALUES,
    { setSubmitting, resetForm }: any
  ) => {
    try {
      let response;
      if (address) {
        response = await Address.update(address.id, values, sessionToken);
      } else {
        response = await Address.create(values, sessionToken);
      }

      if (response?.data?.success || response?.success) {
        notifySuccess(
          address
            ? "Cập nhật địa chỉ thành công!"
            : "Tạo địa chỉ mới thành công!"
        );
        router.push("/my-address");
        router.refresh();
      } else {
        const errorMessage =
          response?.data?.message || response?.message || "Vui lòng thử lại.";
        if (response?.data?.errors) {
          const errorDetails = Object.values(response?.data?.errors)
            .join(", ")
            .replace(/,/g, ".");
          notifyError(
            `${
              address ? "Cập nhật địa chỉ thất bại: " : "Tạo địa chỉ thất bại: "
            } ${errorDetails}`
          );
        } else {
          notifyError(
            `${
              address ? "Cập nhật địa chỉ thất bại: " : "Tạo địa chỉ thất bại: "
            } ${errorMessage}`
          );
        }
      }
    } catch (error: any) {
      notifyError("Đã xảy ra lỗi!");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      onSubmit={handleSubmit}
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
        isSubmitting,
        isValid,
        dirty,
      }) => (
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                name="receiver_name"
                label="Tên người nhận"
                onBlur={handleBlur}
                value={values.receiver_name}
                onChange={handleChange}
                error={!!touched.receiver_name && !!errors.receiver_name}
                helperText={touched.receiver_name && errors.receiver_name}
              />
            </Grid>

            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                name="address"
                label="Địa chỉ"
                onBlur={handleBlur}
                value={values.address}
                onChange={handleChange}
                error={!!touched.address && !!errors.address}
                helperText={touched.address && errors.address}
              />
            </Grid>

            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                name="email"
                label="Email"
                onBlur={handleBlur}
                value={values.email}
                onChange={handleChange}
                error={!!touched.email && !!errors.email}
                helperText={touched.email && errors.email}
              />
            </Grid>

            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                name="phone_number"
                label="Số điện thoại"
                onBlur={handleBlur}
                value={values.phone_number}
                onChange={handleChange}
                error={!!touched.phone_number && !!errors.phone_number}
                helperText={touched.phone_number && errors.phone_number}
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={!dirty || !isValid || isSubmitting}
              >
                {address ? "Cập nhật địa chỉ" : "Tạo địa chỉ mới"}
              </Button>
            </Grid>
          </Grid>
        </form>
      )}
    </Formik>
  );
}
