"use client";

import { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Formik } from "formik";
import UserModel from "../../../models/User.model";
import dayjs from "dayjs";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import CameraEnhance from "@mui/icons-material/CameraEnhance";
import { FlexBox } from "../../../components/flexbox";
import User from "../../../services/User";
import File from "../../../services/File";
import { get } from "../../../hooks/useLocalStorage";
import { notifyError, notifySuccess } from "../../../utils/ToastNotification";

type Props = { user: UserModel };

export default function ProfileEditForm({ user }: Props) {
  const [avatarSrc, setAvatarSrc] = useState(user.avt || "");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isFormChanged, setIsFormChanged] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setAvatarSrc(reader.result as string);
      reader.readAsDataURL(file);
      setIsFormChanged(true);
    }
  };

  const INITIAL_VALUES = {
    full_name: user.full_name || "",
    phone_number: user.phone_number || "",
    dob: user.dob
      ? dayjs(user.dob).format("DD-MM-YYYY")
      : dayjs().format("DD-MM-YYYY"),
  };

  const handleFormSubmit = async (values: typeof INITIAL_VALUES) => {
    try {
      const token = get("token");
      let avatarUrl = user.avt;

      if (avatarFile) {
        const formData = new FormData();
        formData.append("file", avatarFile);

        const uploadRes = await File.upload(formData, token);

        if (uploadRes.data.success && uploadRes.data.data.files.length > 0) {
          avatarUrl = uploadRes.data.data.files[0];
        } else {
          throw new Error("Tải ảnh lên thất bại");
        }
      }
      const res = await User.updateProfile(
        { ...values, avt: avatarUrl },
        token
      );

      if (res.data.success) {
        notifySuccess("Thay đổi thông tin hồ sơ thành công!");
        setIsFormChanged(false);
      } else {
        notifyError(res.data.message);
      }
    } catch (error) {
      notifyError(
        "Có lỗi xảy ra khi thay đổi thông tin hồ sơ. Vui lòng thử lại sau!"
      );
    }
  };

  return (
    <Formik onSubmit={handleFormSubmit} initialValues={INITIAL_VALUES}>
      {({ values, handleChange, handleBlur, handleSubmit, setFieldValue }) => {
        useEffect(() => {
          const hasChanged =
            values.full_name !== INITIAL_VALUES.full_name ||
            values.phone_number !== INITIAL_VALUES.phone_number ||
            values.dob !== INITIAL_VALUES.dob ||
            avatarFile !== null;
          setIsFormChanged(hasChanged);
        }, [values, avatarFile]);

        return (
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
                  type="number"
                />
              </Grid>

              <Grid item md={6} xs={12}>
                <DatePicker
                  label="Ngày Tháng Năm Sinh"
                  value={values.dob ? dayjs(values.dob, "DD-MM-YYYY") : dayjs()}
                  onChange={(newValue) => {
                    if (newValue) {
                      setFieldValue("dob", newValue.format("DD-MM-YYYY"));
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
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={!isFormChanged}
                >
                  Lưu Thay Đổi
                </Button>
              </Grid>
            </Grid>
          </form>
        );
      }}
    </Formik>
  );
}
