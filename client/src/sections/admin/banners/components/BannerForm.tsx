"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import { Formik } from "formik";
import * as yup from "yup";
import MTDropZone from "../../../../components/MTDropZone";
import File from "../../../../services/File";
import Banner from "../../../../services/Banner";
import { get } from "../../../../hooks/useLocalStorage";
import {
  notifyError,
  notifySuccess,
} from "../../../../utils/ToastNotification";
import BannerModel from "../../../../models/Banner.model";

const VALIDATION_SCHEMA = yup.object().shape({
  serial: yup.number().required("Thứ tự là bắt buộc"),
  title: yup
    .string()
    .required("Tiêu đề là bắt buộc")
    .test("word-count", "Tiêu đề không được quá 60 từ", (value) =>
      value ? value.split(" ").filter((word) => word).length <= 60 : true
    ),
  description: yup
    .string()
    .required("Mô tả là bắt buộc")
    .test("word-count", "Mô tả không được quá 300 từ", (value) =>
      value ? value.split(" ").filter((word) => word).length <= 300 : true
    ),
  button_text: yup
    .string()
    .required("Nội dung nút là bắt buộc")
    .test("word-count", "Nội dung nút không được quá 30 từ", (value) =>
      value ? value.split(" ").filter((word) => word).length <= 30 : true
    ),
  button_link: yup.string().required("Liên kết là bắt buộc"),
  status: yup.number().oneOf([0, 1]).required("Trạng thái là bắt buộc"),
});

type Props = { banner?: BannerModel };

export default function BannerForm({ banner }: Props) {
  console.log(banner);
  const [files, setFiles] = useState<File[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(
    banner?.banner_image || null
  );
  const router = useRouter();
  const [isFormChanged, setIsFormChanged] = useState(false);
  const INITIAL_VALUES = {
    serial: banner?.serial ? parseInt(banner.serial) : 0,
    title: banner?.title || "",
    description: banner?.description || "",
    button_text: banner?.button_text || "",
    button_link: banner?.button_link || "",
    status: banner?.status === "1" || banner?.status === 1 ? 1 : 0,
    banner_image: banner?.banner_image || "",
  };

  const handleFormSubmit = async (values: typeof INITIAL_VALUES) => {
    try {
      const token = get("token");
      let imageUrl = values.banner_image;

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

      if (banner) {
        const res = await Banner.update(
          banner.id,
          { ...values, banner_image: imageUrl },
          token
        );
        if (res.data.success) {
          notifySuccess("Thay đổi thông tin banner thành công!");
        } else {
          notifyError(
            "Thay đổi thông tin banner thất bại: " + res.data.message
          );
        }
      } else {
        const res = await Banner.create(
          { ...values, banner_image: imageUrl },
          token
        );
        if (res.data.success) {
          notifySuccess("Tạo banner mới thành công!");
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
            <Grid item xs={12} mb={4}>
              <MTDropZone
                title="Kéo và thả hình ảnh banner"
                onChange={(files) => handleChangeDropZone(files)}
                initialImage={previewImage}
              />
            </Grid>
            <Grid container spacing={3}>
              <Grid item sm={6} xs={12}>
                <TextField
                  fullWidth
                  name="serial"
                  label="Thứ tự"
                  color="info"
                  size="medium"
                  type="number"
                  value={values.serial}
                  onBlur={handleBlur}
                  onChange={handleFieldChange(handleChange, setFieldValue)}
                  helperText={touched.serial && errors.serial}
                  error={Boolean(touched.serial && errors.serial)}
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <TextField
                  fullWidth
                  name="title"
                  label="Tiêu đề"
                  color="info"
                  size="medium"
                  value={values.title}
                  onBlur={handleBlur}
                  onChange={handleFieldChange(handleChange, setFieldValue)}
                  helperText={touched.title && errors.title}
                  error={Boolean(touched.title && errors.title)}
                />
              </Grid>
              <Grid item sm={12} xs={12}>
                <TextField
                  fullWidth
                  name="description"
                  label="Mô tả"
                  color="info"
                  size="medium"
                  multiline
                  rows={3}
                  value={values.description}
                  onBlur={handleBlur}
                  onChange={handleFieldChange(handleChange, setFieldValue)}
                  helperText={touched.description && errors.description}
                  error={Boolean(touched.description && errors.description)}
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <TextField
                  fullWidth
                  name="button_text"
                  label="Nội dung nút"
                  color="info"
                  size="medium"
                  value={values.button_text}
                  onBlur={handleBlur}
                  onChange={handleFieldChange(handleChange, setFieldValue)}
                  helperText={touched.button_text && errors.button_text}
                  error={Boolean(touched.button_text && errors.button_text)}
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <TextField
                  fullWidth
                  name="button_link"
                  label="Liên kết"
                  color="info"
                  size="medium"
                  value={values.button_link}
                  onBlur={handleBlur}
                  onChange={handleFieldChange(handleChange, setFieldValue)}
                  helperText={touched.button_link && errors.button_link}
                  error={Boolean(touched.button_link && errors.button_link)}
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <TextField
                  select
                  fullWidth
                  color="info"
                  size="medium"
                  name="status"
                  value={values.status === 1 ? "1" : "0"}
                  onChange={(e) => {
                    setFieldValue("status", e.target.value === "1" ? 1 : 0);
                    setIsFormChanged(true);
                  }}
                  label="Trạng thái"
                >
                  <MenuItem value="1">Hiển thị</MenuItem>
                  <MenuItem value="0">Ẩn</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} mt={3} textAlign="center">
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => router.push("/admin/banners")}
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
                  {banner ? "Lưu thông tin" : "Tạo banner"}
                </Button>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </Card>
  );
}
