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
  MenuItem,
  Divider,
  Autocomplete,
} from "@mui/material";
import {
  notifyError,
  notifySuccess,
} from "../../../../../../utils/ToastNotification";
import ChildCategoryModel from "../../../../../../models/ChildCategory.model";
import ChildCategory from "../../../../../../services/ChildCategory";
import CategoriesModel from "../../../../../../models/Categories.model";
import { useAppContext } from "../../../../../../context/AppContext";
import { slugify } from "../../../../../../utils/slugify";
type FormEffectProps = {
  categories: CategoriesModel[];
  setIsFormChanged: React.Dispatch<React.SetStateAction<boolean>>;
};

const FormEffect: React.FC<FormEffectProps> = ({
  categories,
  setIsFormChanged,
}) => {
  const { values, setFieldValue } = useFormikContext<any>();

  useEffect(() => {
    const updateSlugAndUrl = () => {
      const newNameCode = slugify(values.name);
      const parentCategory = categories.find(
        (cat) => cat.id === values.sub_cate_id
      );
      const parentUrl = parentCategory ? parentCategory.url : "";
      const newUrl =
        parentUrl && newNameCode ? `${parentUrl}/${newNameCode}` : "";

      if (newNameCode !== values.name_code) {
        setFieldValue("name_code", newNameCode);
        setIsFormChanged(true);
      }

      if (newUrl !== values.url) {
        setFieldValue("url", newUrl);
        setIsFormChanged(true);
      }
    };

    updateSlugAndUrl();
  }, [values.name, values.sub_cate_id]);

  return null;
};
const VALIDATION_SCHEMA = yup.object().shape({
  sub_cate_id: yup.string().required("Tên danh mục cha là bắt buộc"),
  name: yup
    .string()
    .required("Tên danh mục con là bắt buộc")
    .max(50, "Tên danh mục con không được vượt quá 50 ký tự"),
  name_code: yup
    .string()
    .required("Mã tên danh mục con là bắt buộc")
    .max(30, "Mã tên không được vượt quá 30 ký tự"),
  url: yup.string().nullable(),
  status: yup
    .number()
    .required("Trạng thái là bắt buộc")
    .oneOf([0, 1], "Trạng thái phải là 0 hoặc 1"),
});

type Props = {
  childCategory?: any;
  categories: CategoriesModel[];
};

export default function ChildCategoryForm({
  childCategory,
  categories,
}: Props) {
  const router = useRouter();
  const [isFormChanged, setIsFormChanged] = useState(false);
  const { sessionToken } = useAppContext();

  const INITIAL_VALUES = {
    sub_cate_id: childCategory?.parentid || "",
    name: childCategory?.name || "",
    name_code: childCategory?.nameCode || "",
    url: childCategory?.url || "",
    status: childCategory?.status === 1 ? 1 : 0,
  };

  const handleFormSubmit = async (values: typeof INITIAL_VALUES) => {
    try {
      let res;
      if (childCategory) {
        res = await ChildCategory.update(
          childCategory.id,
          values,
          sessionToken
        );
      } else {
        res = await ChildCategory.create(values, sessionToken);
      }

      if (res.success) {
        notifySuccess(
          childCategory
            ? "Thay đổi thông tin danh mục con thành công!"
            : "Tạo danh mục con mới thành công!"
        );
        router.push("/dashboard/admin/categories/sub-category/child");
        router.refresh();
      } else {
        const errorMessage = res?.message || "Vui lòng thử lại.";
        notifyError(errorMessage);
      }

      setIsFormChanged(false);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Vui lòng thử lại sau.";
      notifyError(errorMessage);
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
            <FormEffect
              categories={categories}
              setIsFormChanged={setIsFormChanged}
            />

            <Divider sx={{ mb: 3 }} />
            <Grid container spacing={3}>
              <Grid item sm={6} xs={12}>
                <Autocomplete
                  fullWidth
                  options={categories}
                  getOptionLabel={(option) => option.name || ""}
                  value={
                    categories.find((cat) => cat.id === values.sub_cate_id) ||
                    null
                  }
                  onChange={(event, newValue) => {
                    setFieldValue("sub_cate_id", newValue ? newValue.id : "");
                    setIsFormChanged(true);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Tên danh mục cha"
                      color="info"
                      size="medium"
                      error={Boolean(touched.sub_cate_id && errors.sub_cate_id)}
                      helperText={
                        touched.sub_cate_id && errors.sub_cate_id
                          ? String(errors.sub_cate_id)
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
                    touched.name && errors.name ? String(errors.name) : ""
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
                      ? String(errors.name_code)
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
                    touched.url && errors.url ? String(errors.url) : ""
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
                  <MenuItem value={1}>Hiển thị</MenuItem>
                  <MenuItem value={0}>Ẩn</MenuItem>
                </TextField>
              </Grid>
            </Grid>
            <Box mt={4} textAlign="center">
              <Button
                variant="outlined"
                color="secondary"
                onClick={() =>
                  router.push("/dashboard/admin/categories/sub-category/child")
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
                {childCategory ? "Lưu thông tin" : "Tạo danh mục con"}
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Card>
  );
}
