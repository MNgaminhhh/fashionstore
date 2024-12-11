"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, Grid, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import dayjs from "dayjs";
import FlashSaleModel from "../../../../models/FlashSale.model";
import FlashSale from "../../../../services/FlashSale";
import {
  notifyError,
  notifySuccess,
} from "../../../../utils/ToastNotification";

const VALIDATION_SCHEMA = yup.object().shape({
  start_date: yup
    .date()
    .required("Ngày giờ bắt đầu là bắt buộc")
    .typeError("Ngày giờ bắt đầu không hợp lệ"),
  end_date: yup
    .date()
    .required("Ngày giờ kết thúc là bắt buộc")
    .typeError("Ngày giờ kết thúc không hợp lệ")
    .min(yup.ref("start_date"), "Ngày giờ kết thúc phải sau ngày giờ bắt đầu"),
});

type Props = {
  flashSale?: FlashSaleModel;
  token: string;
};

export default function FlashSaleForm({ flashSale, token }: Props) {
  const router = useRouter();
  const [isFormChanged, setIsFormChanged] = useState(false);
  const [uploading, setUploading] = useState(false);

  const INITIAL_VALUES = {
    start_date: flashSale
      ? dayjs.utc(flashSale.StartDate).format("YYYY-MM-DDTHH:mm")
      : "",
    end_date: flashSale
      ? dayjs.utc(flashSale.EndDate).format("YYYY-MM-DDTHH:mm")
      : "",
  };

  const handleFormSubmit = async (values: typeof INITIAL_VALUES) => {
    try {
      setUploading(true);
      const formattedData = {
        start_date: dayjs.utc(values.start_date).format("DD-MM-YYYY HH:mm"),
        end_date: dayjs.utc(values.end_date).format("DD-MM-YYYY HH:mm"),
      };

      let response;
      if (flashSale) {
        response = await FlashSale.update(flashSale.ID, formattedData, token);
      } else {
        response = await FlashSale.create(formattedData, token);
      }

      if (response.data.success) {
        notifySuccess(
          flashSale
            ? "Thay đổi thông tin Flash Sale thành công!"
            : "Tạo Flash Sale mới thành công!"
        );
        router.push("/dashboard/admin/flash-sale");
        router.refresh();
      } else {
        notifyError(
          `${
            flashSale
              ? "Thay đổi thông tin Flash Sale thất bại: "
              : "Tạo Flash Sale thất bại: "
          }${response.data.message}`
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
        HTMLInputElement | { name?: string; value: unknown }
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
                  name="start_date"
                  label="Ngày giờ bắt đầu"
                  color="info"
                  size="medium"
                  type="datetime-local"
                  value={values.start_date}
                  onBlur={handleBlur}
                  onChange={handleFieldChange(handleChange, setFieldValue)}
                  helperText={touched.start_date && errors.start_date}
                  error={Boolean(touched.start_date && errors.start_date)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

              <Grid item sm={6} xs={12}>
                <TextField
                  fullWidth
                  name="end_date"
                  label="Ngày giờ kết thúc"
                  color="info"
                  size="medium"
                  type="datetime-local"
                  value={values.end_date}
                  onBlur={handleBlur}
                  onChange={handleFieldChange(handleChange, setFieldValue)}
                  helperText={touched.end_date && errors.end_date}
                  error={Boolean(touched.end_date && errors.end_date)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

              <Grid item xs={12} mt={3} textAlign="center">
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => router.push("/dashboard/admin/flash-sale")}
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
                    : flashSale
                    ? "Lưu thông tin"
                    : "Tạo Flash Sale"}
                </Button>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </Card>
  );
}
