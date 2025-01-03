"use client";

import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Formik, Form, FormikHelpers } from "formik";
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
} from "@mui/material";
import OptionVariantModel from "../../../../models/OptionVariant.model";
import OptionVariant from "../../../../services/OptionVariant";
import {
  notifyError,
  notifySuccess,
} from "../../../../utils/ToastNotification";

interface OptionVariantFormValues {
  name: string;
  status: "active" | "inactive";
}

interface OpVariantCreate {
  name: string;
  status: "active" | "inactive";
  product_variant: string;
}

interface OpVariantUpdate {
  name: string;
  status: "active" | "inactive";
}

type Props = {
  optionVariant?: OptionVariantModel;
  token: string;
};

const OptionVariantSchema = Yup.object({
  name: Yup.string().required("Tên tùy chọn là bắt buộc"),
  status: Yup.string()
    .oneOf(["active", "inactive"], "Trạng thái không hợp lệ")
    .required("Trạng thái là bắt buộc"),
});

const INITIAL_VALUES = (
  optionVariant?: OptionVariantModel
): OptionVariantFormValues => ({
  name: optionVariant?.name || "",
  status: optionVariant?.status || "active",
});

export default function OptionVariantForm({ optionVariant, token }: Props) {
  const router = useRouter();
  const params = useParams();
  const { id, vid } = params;
  const [isFormChanged, setIsFormChanged] = useState(false);
  const [loading, setLoading] = useState(false);
  const productId = Array.isArray(id) ? id[0] : id;
  const productVariantId = Array.isArray(vid) ? vid[0] : vid;

  const handleSubmit = async (
    values: OptionVariantFormValues,
    { setSubmitting }: FormikHelpers<OptionVariantFormValues>
  ) => {
    setLoading(true);
    try {
      let response;

      if (optionVariant) {
        const optionVariantData: OpVariantUpdate = {
          name: values.name,
          status: values.status,
        };

        response = await OptionVariant.update(
          optionVariant.id,
          optionVariantData,
          token,
          true
        );

        if (response.data.success) {
          notifySuccess("Cập nhật tùy chọn biến thể thành công!");
        } else {
          notifyError(
            "Cập nhật tùy chọn biến thể thất bại: " +
              (response.message || "Vui lòng thử lại.")
          );
          return;
        }
      } else {
        const optionVariantData: OpVariantCreate = {
          name: values.name,
          status: values.status,
          product_variant: productVariantId,
        };

        response = await OptionVariant.create(optionVariantData, token, true);

        if (response.success) {
          notifySuccess("Tạo mới tùy chọn biến thể thành công!");
        } else {
          notifyError(
            "Tạo mới tùy chọn biến thể thất bại: " +
              (response.message || "Vui lòng thử lại!")
          );
          return;
        }
      }
      router.push(
        `/dashboard/vendor/product/${productId}/variant/${productVariantId}/option-variant`
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
    <Card sx={{ p: 4, mx: "auto", boxShadow: 3 }}>
      <Formik<OptionVariantFormValues>
        initialValues={INITIAL_VALUES(optionVariant)}
        validationSchema={OptionVariantSchema}
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
            <Box mb={3}>
              <TextField
                fullWidth
                name="name"
                label="Tên Tùy Chọn"
                color="info"
                size="medium"
                value={values.name}
                onBlur={handleBlur}
                onChange={handleFieldChange(handleChange, setFieldValue)}
                helperText={touched.name && errors.name}
                error={Boolean(touched.name && errors.name)}
                disabled={loading}
              />
            </Box>
            <Box mb={3}>
              <FormControl
                fullWidth
                color="info"
                size="medium"
                disabled={loading}
              >
                <InputLabel id="status-label">Trạng Thái</InputLabel>
                <Select
                  labelId="status-label"
                  id="status"
                  name="status"
                  value={values.status}
                  label="Trạng Thái"
                  onChange={(e) => {
                    setFieldValue("status", e.target.value);
                    setIsFormChanged(true);
                  }}
                  onBlur={handleBlur}
                  error={Boolean(touched.status && errors.status)}
                >
                  <MenuItem value="active">Hoạt Động</MenuItem>
                  <MenuItem value="inactive">Không Hoạt Động</MenuItem>
                </Select>
                {touched.status && errors.status && (
                  <Typography color="error" variant="caption">
                    {errors.status}
                  </Typography>
                )}
              </FormControl>
            </Box>

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
                    `/dashboard/vendor/product/${productId}/variant/${productVariantId}/option-variant`
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
                ) : optionVariant ? (
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
