"use client";

import { useState } from "react";
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
} from "@mui/material";
import VariantModel from "../../../../models/Variant.model";
import Variant from "../../../../services/Variant";
import {
  notifyError,
  notifySuccess,
} from "../../../../utils/ToastNotification";

type Props = {
  variant?: VariantModel;
  token?: string;
};

const VariantSchema = Yup.object().shape({
  name: Yup.string().required("Tên biến thể là bắt buộc"),
  status: Yup.string()
    .oneOf(["active", "inactive"], "Trạng thái không hợp lệ")
    .required("Trạng thái là bắt buộc"),
});

const INITIAL_VALUES = (variant?: VariantModel) => ({
  id: variant?.id || "",
  name: variant?.name || "",
  status: variant?.status || "active",
});

export default function VariantForm({ variant, token }: Props) {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const [isFormChanged, setIsFormChanged] = useState(false);
  const [loading, setLoading] = useState(false);
  const productId = Array.isArray(id) ? id[0] : id;

  const handleSubmit = async (
    values: typeof INITIAL_VALUES,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    setLoading(true);
    try {
      const variantData: VariantModel = {
        name: values.name,
        product_id: productId,
        status: values.status,
      };

      let response;

      if (variant) {
        response = await Variant.update(variant.id, variantData, token);
        if (response.data.success) {
          notifySuccess("Cập nhật biến thể thành công!");
        } else {
          notifyError(
            "Cập nhật biến thể thất bại: " +
              (response.data.message || "Vui lòng thử lại.")
          );
          return;
        }
      } else {
        response = await Variant.create(variantData, token);
        if (response.data.success) {
          notifySuccess("Tạo mới biến thể thành công!");
        } else {
          notifyError(
            "Tạo mới biến thể thất bại: " +
              (response.data.message || "Vui lòng thử lại!")
          );
          return;
        }
      }

      router.push(`/dashboard/vendor/product/${productId}/variant`);
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
      <Formik
        initialValues={INITIAL_VALUES(variant)}
        validationSchema={VariantSchema}
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
                label="Tên Biến Thể"
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
                  router.push(`/dashboard/vendor/product/${productId}/variant`)
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
                ) : variant ? (
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
