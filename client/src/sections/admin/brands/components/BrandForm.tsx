"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import { Formik } from "formik";
import * as yup from "yup";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import MTDropZone from "../../../../components/MTDropZone";
import BrandsModel from "../../../../models/Brands.model";
import File from "../../../../services/File";
import Brand from "../../../../services/Brand";
import { get } from "../../../../hooks/useLocalStorage";
import {
  notifyError,
  notifySuccess,
} from "../../../../utils/ToastNotification";

const VALIDATION_SCHEMA = yup.object().shape({
  sequence: yup.number().required("Thứ tự là bắt buộc"),
  name: yup.string().required("Tên thương hiệu là bắt buộc"),
  store_id: yup.string().required("Mã cửa hàng là bắt buộc"),
  visible: yup.boolean().required("Trạng thái là bắt buộc"),
});

type Props = { brand?: BrandsModel };

export default function BrandForm({ brand }: Props) {
  const [files, setFiles] = useState<File[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(
    brand?.image || null
  );
  const router = useRouter();
  const [isFormChanged, setIsFormChanged] = useState(false);
  const INITIAL_VALUES = {
    sequence: brand?.sequence ? parseInt(brand.sequence) : 0,
    name: brand?.name || "",
    store_id: brand?.store_id || "",
    visible: brand?.visible === "true" || brand?.visible === true,
    image: brand?.image || "",
  };

  const handleFormSubmit = async (values: typeof INITIAL_VALUES) => {
    try {
      const token = get("token");
      let imageUrl = values.image;

      if (files.length > 0) {
        const formData = new FormData();
        formData.append("file", files[0]);
        const uploadRes = await File.upload(formData, token);

        if (uploadRes.data.success && uploadRes.data.data.files.length > 0) {
          imageUrl = uploadRes.data.data.files[0];
        } else {
          notifyError("Tải ảnh lên thất bại");
        }
      }
      if (brand) {
        const res = await Brand.update(
          brand.id,
          { ...values, image: imageUrl },
          token
        );
        if (res.data.success) {
          notifySuccess("Thay đổi thông tin thương hiệu thành công!");
        } else {
          notifyError(
            "Thay đổi thông tin thương hiệu thất bại: " + res.data.message
          );
        }
      } else {
        const res = await Brand.create({ ...values, image: imageUrl }, token);
        if (res.data.success) {
          notifySuccess("Tạo thương hiệu mới thành công!");
        } else {
          notifyError("Tạo thất bại: " + res.data.message);
        }
      }
      setIsFormChanged(false);
    } catch (error) {
      notifyError("Có lỗi xảy ra. Vui lòng thử lại sau!");
    }
  };

  const handleChangeDropZone = (files: File[]) => {
    files.forEach((file) =>
      Object.assign(file, { preview: URL.createObjectURL(file) })
    );
    setFiles(files);
    setPreviewImage(files[0]?.preview || null);
    setIsFormChanged(true);
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
            <Typography variant="h5" mb={2} textAlign="center">
              {brand ? "Chỉnh sửa thương hiệu" : "Tạo thương hiệu mới"}
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <Grid item xs={12} mb={4}>
              <MTDropZone
                title="Kéo và thả hình ảnh thương hiệu"
                onChange={(files) => handleChangeDropZone(files)}
                initialImage={previewImage}
              />
            </Grid>
            <Grid container spacing={3}>
              <Grid item sm={6} xs={12}>
                <TextField
                  fullWidth
                  name="sequence"
                  label="Thứ tự"
                  color="info"
                  size="medium"
                  type="number"
                  value={values.sequence}
                  onBlur={handleBlur}
                  onChange={handleFieldChange(handleChange, setFieldValue)}
                  helperText={touched.sequence && errors.sequence}
                  error={Boolean(touched.sequence && errors.sequence)}
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <TextField
                  fullWidth
                  name="name"
                  label="Tên thương hiệu"
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
                  name="store_id"
                  label="Mã cửa hàng"
                  color="info"
                  size="medium"
                  value={values.store_id}
                  onBlur={handleBlur}
                  onChange={handleFieldChange(handleChange, setFieldValue)}
                  helperText={touched.store_id && errors.store_id}
                  error={Boolean(touched.store_id && errors.store_id)}
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <TextField
                  select
                  fullWidth
                  color="info"
                  size="medium"
                  name="visible"
                  value={values.visible ? "true" : "false"}
                  onChange={(e) => {
                    setFieldValue("visible", e.target.value === "true");
                    setIsFormChanged(true);
                  }}
                  label="Trạng thái"
                >
                  <MenuItem value="true">Hiển thị</MenuItem>
                  <MenuItem value="false">Ẩn</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} mt={3} textAlign="center">
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => router.back()}
                  sx={{ px: 4, py: 1, mr: 2, textTransform: "none" }}
                >
                  Trở về
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={!isFormChanged}
                  sx={{ px: 4, py: 1, textTransform: "none" }}
                >
                  {brand ? "Lưu thông tin" : "Tạo thương hiệu"}
                </Button>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </Card>
  );
}
