"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Formik, useFormikContext } from "formik";
import * as yup from "yup";
import {
  Box,
  Button,
  Card,
  Grid,
  TextField,
  Typography,
  Divider,
  Autocomplete,
  MenuItem,
} from "@mui/material";
import {
  notifyError,
  notifySuccess,
} from "../../../../../utils/ToastNotification";
import SubCategory from "../../../../../services/SubCategory";
import { useAppContext } from "../../../../../context/AppContext";
import { slugify } from "../../../../../utils/slugify";
type SubCategoryFormEffectProps = {
  categories: any;
  setIsFormChanged: React.Dispatch<React.SetStateAction<boolean>>;
};

const SubCategoryFormEffect: React.FC<SubCategoryFormEffectProps> = ({
  categories,
  setIsFormChanged,
}) => {
  const { values, setFieldValue } = useFormikContext<any>();

  useEffect(() => {
    const newNameCode = slugify(values.name);

    const parentCategory = categories.find(
      (cat) => cat.name === values.cate_name
    );
    const parentUrl = parentCategory ? parentCategory.url : "";
    const newUrl = `${parentUrl}/${newNameCode}`;

    if (newNameCode !== values.name_code) {
      setFieldValue("name_code", newNameCode);
      setIsFormChanged(true);
    }

    if (newUrl !== values.url) {
      setFieldValue("url", newUrl);
      setIsFormChanged(true);
    }
  }, [values.name, values.cate_name]);

  return null;
};
const VALIDATION_SCHEMA = yup.object().shape({
  cate_name: yup
    .string()
    .required("Tên danh mục cha là bắt buộc")
    .max(50, "Tên danh mục cha không được vượt quá 50 ký tự"),
  name: yup
    .string()
    .required("Tên danh mục con là bắt buộc")
    .max(50, "Tên danh mục con không được vượt quá 50 ký tự"),
  name_code: yup
    .string()
    .required("Mã tên danh mục con là bắt buộc")
    .max(30, "Mã tên không được vượt quá 30 ký tự"),
  url: yup.string(),
  status: yup.number().required("Trạng thái là bắt buộc"),
});

type CategoryOption = {
  id: string;
  name: string;
  name_code: string;
};

type Props = {
  subcategory?: any;
  categories?: CategoryOption[];
};

export default function SubCategoryForm({ subcategory, categories }: Props) {
  const router = useRouter();
  const [isFormChanged, setIsFormChanged] = useState(false);
  const { sessionToken } = useAppContext();

  const INITIAL_VALUES = {
    cate_name: subcategory?.parent || "",
    name: subcategory?.name || "",
    component: subcategory?.component || "MegaMenu1.name",
    name_code: subcategory?.nameCode || "",
    url: subcategory?.url || "",
    status: subcategory?.status === 1 ? 1 : 0,
  };

  const handleFormSubmit = async (values: typeof INITIAL_VALUES) => {
    try {
      let res;
      if (subcategory) {
        res = await SubCategory.update(subcategory.id, values, sessionToken);
      } else {
        res = await SubCategory.create(values, sessionToken);
      }

      if (res.success) {
        notifySuccess(
          subcategory
            ? "Thay đổi thông tin danh mục con thành công!"
            : "Tạo danh mục con mới thành công!"
        );
        router.push("/dashboard/admin/categories/sub-category");
        router.refresh();
      } else {
        const errorMessage = res?.message || "Vui lòng thử lại.";
        notifyError(
          subcategory
            ? `Thay đổi thông tin danh mục con thất bại: ${errorMessage}`
            : `Tạo danh mục con thất bại: ${errorMessage}`
        );
      }

      setIsFormChanged(false);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Vui lòng thử lại sau.";
      notifyError(
        subcategory
          ? `Có lỗi xảy ra khi thay đổi thông tin danh mục con: ${errorMessage}`
          : `Có lỗi xảy ra khi tạo danh mục con mới: ${errorMessage}`
      );
    }
  };

  const handleFieldChange =
    (handleChange: any, setFieldValue: any) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = event.target;
      if (name) {
        setFieldValue(name, value);
        setIsFormChanged(true);
      }
      handleChange(event);
    };

  const categoryOptions: CategoryOption[] = Array.isArray(categories)
    ? categories
    : [];

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
            {/* Include the SubCategoryFormEffect component */}
            <SubCategoryFormEffect
              categories={categoryOptions}
              setIsFormChanged={setIsFormChanged}
            />

            <Divider sx={{ mb: 3 }} />
            <Grid container spacing={3}>
              <Grid item sm={6} xs={12}>
                <Autocomplete
                  fullWidth
                  options={categoryOptions}
                  getOptionLabel={(option) => option.name || ""}
                  value={
                    categoryOptions.find(
                      (cat) => cat.name === values.cate_name
                    ) || null
                  }
                  onChange={(event, newValue) => {
                    setFieldValue("cate_name", newValue?.name || "");
                    setIsFormChanged(true);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Tên danh mục cha"
                      color="info"
                      size="medium"
                      error={Boolean(touched.cate_name && errors.cate_name)}
                      helperText={
                        touched.cate_name && errors.cate_name
                          ? typeof errors.cate_name === "string"
                            ? errors.cate_name
                            : Array.isArray(errors.cate_name)
                            ? errors.cate_name.join(", ")
                            : ""
                          : ""
                      }
                    />
                  )}
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <TextField
                  fullWidth
                  name="name"
                  label="Tên danh mục con"
                  color="info"
                  size="medium"
                  value={values.name}
                  onBlur={handleBlur}
                  onChange={(e) => {
                    handleChange(e);
                    setIsFormChanged(true);
                  }}
                  helperText={
                    touched.name && errors.name
                      ? typeof errors.name === "string"
                        ? errors.name
                        : Array.isArray(errors.name)
                        ? errors.name.join(", ")
                        : ""
                      : ""
                  }
                  error={Boolean(touched.name && errors.name)}
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <TextField
                  fullWidth
                  name="name_code"
                  label="Mã tên danh mục con"
                  color="info"
                  size="medium"
                  value={values.name_code}
                  disabled
                  helperText={
                    touched.name_code && errors.name_code
                      ? typeof errors.name_code === "string"
                        ? errors.name_code
                        : Array.isArray(errors.name_code)
                        ? errors.name_code.join(", ")
                        : ""
                      : ""
                  }
                  error={Boolean(touched.name_code && errors.name_code)}
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <TextField
                  fullWidth
                  name="url"
                  label="Đường dẫn"
                  color="info"
                  size="medium"
                  value={values.url}
                  disabled
                  helperText={
                    touched.url && errors.url
                      ? typeof errors.url === "string"
                        ? errors.url
                        : Array.isArray(errors.url)
                        ? errors.url.join(", ")
                        : ""
                      : ""
                  }
                  error={Boolean(touched.url && errors.url)}
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <TextField
                  select
                  fullWidth
                  name="status"
                  label="Trạng thái"
                  color="info"
                  size="medium"
                  value={String(values.status)}
                  onChange={(e) => {
                    setFieldValue("status", Number(e.target.value));
                    setIsFormChanged(true);
                  }}
                  helperText={touched.status && errors.status}
                  error={Boolean(touched.status && errors.status)}
                >
                  <MenuItem value="1">Hiển thị</MenuItem>
                  <MenuItem value="0">Ẩn</MenuItem>
                </TextField>
              </Grid>
            </Grid>
            <Box mt={4} textAlign="center">
              <Button
                variant="outlined"
                color="secondary"
                onClick={() =>
                  router.push("/dashboard/admin/categories/sub-category")
                }
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
                {subcategory ? "Lưu thông tin" : "Tạo danh mục con"}
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Card>
  );
}
