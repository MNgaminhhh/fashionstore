"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import { Formik, useFormikContext } from "formik";
import * as yup from "yup";
import Divider from "@mui/material/Divider";
import * as Icons from "react-icons/fa";
import {
  notifyError,
  notifySuccess,
} from "../../../../utils/ToastNotification";
import Categories from "../../../../services/Categories";
import { useAppContext } from "../../../../context/AppContext";
import { slugify } from "../../../../utils/slugify";
interface FormValues {
  name: string;
  name_code: string;
  url: string;
  icon: string;
  status: string | boolean;
  component: string;
}

type CategoriesFormEffectProps = {
  setIsFormChanged: React.Dispatch<React.SetStateAction<boolean>>;
};

const CategoriesFormEffect: React.FC<CategoriesFormEffectProps> = ({
  setIsFormChanged,
}) => {
  const { values, setFieldValue } = useFormikContext<FormValues>();

  useEffect(() => {
    const newNameCode = slugify(values.name);
    const newUrl = `/categories/${newNameCode}`;

    let changed = false;

    if (newNameCode !== values.name_code) {
      setFieldValue("name_code", newNameCode);
      changed = true;
    }

    if (newUrl !== values.url) {
      setFieldValue("url", newUrl);
      changed = true;
    }

    if (changed) {
      setIsFormChanged(true);
    }
  }, [values.name, values.name_code, values.url]);

  return null;
};

const VALIDATION_SCHEMA = yup.object().shape({
  name: yup
    .string()
    .required("Tên danh mục là bắt buộc")
    .max(50, "Tên danh mục không được vượt quá 50 ký tự"),
  name_code: yup
    .string()
    .required("Mã tên danh mục là bắt buộc")
    .max(30, "Mã tên không được vượt quá 30 ký tự"),
  url: yup.string(),
  icon: yup.string().required("Biểu tượng là bắt buộc"),
  status: yup.boolean().required("Trạng thái là bắt buộc"),
});

const availableIcons = Object.keys(Icons).filter((key) => key.startsWith("Fa"));

type Props = {
  category?: any;
};

export default function CategoriesForm({ category }: Props) {
  const router = useRouter();
  const [isFormChanged, setIsFormChanged] = useState(false);
  const { sessionToken } = useAppContext();

  const INITIAL_VALUES = {
    name: category?.name || "",
    name_code: category?.nameCode || "",
    url: category ? category.url : "",
    icon: category?.icon || availableIcons[0],
    status: category?.status === "1" ? "1" : "0",
    component: category?.component || "MegaMenu1.name",
  };

  const handleFormSubmit = async (values: typeof INITIAL_VALUES) => {
    try {
      if (category) {
        const res = await Categories.update(category.id, values, sessionToken);
        if (res.data.success) {
          notifySuccess("Thay đổi thông tin danh mục thành công!");
        } else {
          notifyError(
            "Thay đổi thông tin danh mục thất bại: " + res.data.message
          );
        }
      } else {
        const res = await Categories.create(values);
        if (res.data.success) {
          notifySuccess("Tạo danh mục mới thành công!");
        } else {
          notifyError("Tạo thất bại. Vui lòng thử lại sau!");
        }
      }
      setIsFormChanged(false);
      router.push("/dashboard/admin/categories");
      router.refresh();
    } catch (error) {
      notifyError("Có lỗi xảy ra. Vui lòng thử lại sau!");
    }
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
            {/* Include the CategoriesFormEffect component */}
            <CategoriesFormEffect setIsFormChanged={setIsFormChanged} />

            <Divider sx={{ mb: 3 }} />
            <Grid container spacing={3}>
              <Grid item sm={6} xs={12}>
                <TextField
                  fullWidth
                  name="name"
                  label="Tên danh mục"
                  color="info"
                  size="medium"
                  value={values.name}
                  onBlur={handleBlur}
                  onChange={(e) => {
                    handleChange(e);
                    setIsFormChanged(true);
                  }}
                  helperText={
                    touched.name && errors.name ? (errors.name as string) : ""
                  }
                  error={Boolean(touched.name && errors.name)}
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <TextField
                  fullWidth
                  name="name_code"
                  label="Mã tên danh mục"
                  color="info"
                  size="medium"
                  value={values.name_code}
                  disabled
                  helperText={
                    touched.name_code && errors.name_code
                      ? (errors.name_code as string)
                      : ""
                  }
                  error={Boolean(touched.name_code && errors.name_code)}
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <TextField
                  fullWidth
                  name="url"
                  label="URL"
                  color="info"
                  size="medium"
                  value={values.url}
                  disabled
                  helperText={touched.url ? (errors.url as string) : ""}
                  error={Boolean(touched.url && errors.url)}
                />
              </Grid>
              <Grid item sm={6} xs={12}>
                <TextField
                  select
                  fullWidth
                  name="icon"
                  label="Biểu tượng"
                  color="info"
                  size="medium"
                  value={values.icon}
                  onChange={(e) => {
                    setFieldValue("icon", e.target.value);
                    setIsFormChanged(true);
                  }}
                  helperText={touched.icon ? (errors.icon as string) : ""}
                  error={Boolean(touched.icon && errors.icon)}
                >
                  {availableIcons.map((iconKey) => {
                    const IconComponent = Icons[iconKey as keyof typeof Icons];
                    return (
                      <MenuItem key={iconKey} value={iconKey}>
                        <IconComponent style={{ marginRight: 8 }} />
                        {iconKey}
                      </MenuItem>
                    );
                  })}
                </TextField>
              </Grid>
              <Grid item sm={6} xs={12}>
                <TextField
                  select
                  fullWidth
                  color="info"
                  size="medium"
                  name="status"
                  value={values.status ? "1" : "0"}
                  onChange={(e) => {
                    setFieldValue("status", e.target.value === "1");
                    setIsFormChanged(true);
                  }}
                  label="Trạng thái"
                  error={Boolean(touched.status && errors.status)}
                  helperText={touched.status && errors.status}
                >
                  <MenuItem value="1">Hiển Thị</MenuItem>
                  <MenuItem value="0">Ẩn</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} mt={3} textAlign="center">
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => router.push("/dashboard/admin/categories")}
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
                  {category ? "Lưu thông tin" : "Tạo danh mục"}
                </Button>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </Card>
  );
}
