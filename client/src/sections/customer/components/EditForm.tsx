"use client";

import { useState } from "react"; // Nhập useState
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import { Formik } from "formik";
import * as yup from "yup";
import UserModel from "../../../models/User.model";
import dayjs from "dayjs";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import CameraEnhance from "@mui/icons-material/CameraEnhance";
import { FlexBox } from "../../../components/flexbox";
import User from "../../../services/User";
import { get } from "../../../hooks/useLocalStorage";

type Props = { user: UserModel };
export default function ProfileEditForm({ user }: Props) {
  const [avatarSrc, setAvatarSrc] = useState(user.avatar || "");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        setAvatarSrc(reader.result as string);
      };

      reader.readAsDataURL(file);
    }
  };

  const INITIAL_VALUES = {
    full_name: user.full_name || "",
    phone_number: user.phone_number || "",
    dob: user.dob ? dayjs(user.dob) : dayjs(),
    // avatar: avatarSrc,
  };

  const VALIDATION = yup.object().shape({
    full_name: yup.string().required("Họ và tên là bắt buộc"),
    phone_number: yup
      .string()
      .matches(/^[0-9]*$/, "Chỉ nhập ký tự số 0-9")
      .min(10, "Số điện thoại phải có ít nhất 10 chữ số")
      .max(11, "Số điện thoại không được quá 11 chữ số"),
    dob: yup.date(),
  });

  const handleFormSubmit = async (values: typeof INITIAL_VALUES) => {
    console.log(values);
    const token = get("token");
    console.log(token);
    await User.updateProfile(values, token);
  };

  return (
    <Formik
      onSubmit={handleFormSubmit}
      initialValues={INITIAL_VALUES}
      validationSchema={VALIDATION}
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
          <FlexBox alignItems="center" mb={3}>
            <Avatar
              alt="Profile Picture"
              src={avatarSrc}
              sx={{
                height: 64,
                width: 64,
                border: "2px solid #1976d2",
                boxShadow: 2,
              }}
            />

            <IconButton
              size="small"
              component="label"
              color="secondary"
              htmlFor="profile-image"
              sx={{ bgcolor: "grey.300", ml: -2.1, mb: -3 }}
            >
              <CameraEnhance fontSize="small" />
            </IconButton>

            <Box
              type="file"
              display="none"
              accept="image/*"
              component="input"
              id="profile-image"
              onChange={handleFileChange}
            />
          </FlexBox>

          <Grid container spacing={3}>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                name="full_name"
                label="Họ và tên"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.full_name}
                error={!!touched.full_name && !!errors.full_name}
                helperText={(touched.full_name && errors.full_name) as string}
              />
            </Grid>

            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Số Điện Thoại"
                name="phone_number"
                onBlur={handleBlur}
                value={values.phone_number}
                onChange={handleChange}
                error={!!touched.phone_number && !!errors.phone_number}
                helperText={
                  (touched.phone_number && errors.phone_number) as string
                }
              />
            </Grid>

            <Grid item md={6} xs={12}>
              <DatePicker
                label="Ngày Tháng Năm Sinh"
                value={dayjs(values.dob)}
                onChange={(newValue) => {
                  if (newValue) {
                    setFieldValue("dob", newValue.format("YYYY-MM-DD"));
                  } else {
                    setFieldValue("dob", null);
                  }
                }}
                format="DD/MM/YYYY"
                slots={{ textField: TextField }}
                slotProps={{
                  textField: {
                    sx: { mb: 1 },
                    size: "small",
                    fullWidth: true,
                    error: Boolean(!!touched.dob && !!errors.dob),
                    helperText: (touched.dob && errors.dob) as string,
                  },
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary">
                Lưu Thay Đổi
              </Button>
            </Grid>
          </Grid>
        </form>
      )}
    </Formik>
  );
}
