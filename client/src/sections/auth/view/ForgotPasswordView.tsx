"use client";

import { Fragment, useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { useFormik } from "formik";
import * as yup from "yup";
import { H3 } from "../../../components/Typography";
import LinkBox from "../components/LinkBox";
import { FlexCenterRow } from "../../../components/flexbox";
import Auth from "../../../services/Auth";
import { notifyError, notifySuccess } from "../../../utils/ToastNotification";
import Button from "@mui/material/Button";

interface ForgotPasswordFormValue {
    email: string;
}

export const ForgotPasswordView = () => {
    const [loading, setLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const initialValues: ForgotPasswordFormValue = {
        email: "",
    };

    const validationSchema = yup.object().shape({
        email: yup
            .string()
            .email("Email không hợp lệ")
            .required("Vui lòng nhập email"),
    });

    const formik = useFormik<ForgotPasswordFormValue>({
        initialValues,
        validationSchema,
        onSubmit: async (values) => {
            setLoading(true);
            try {
                const response = await Auth.sendEmailResetPassword(values.email);
                if (response.data.success) {
                    notifySuccess("Yêu cầu đặt lại mật khẩu đã được gửi! Vui lòng kiểm tra email.");
                    setIsSubmitted(true);
                } else {
                    notifyError(response.data.message || "Yêu cầu đặt lại mật khẩu thất bại.");
                }
            } catch (error) {
                notifyError("Đã xảy ra lỗi trong quá trình gửi yêu cầu đặt lại mật khẩu.");
            } finally {
                setLoading(false);
            }
        },
    });

    return (
        <Fragment>
            <H3 mb={3} textAlign="center">
                Nhập email để đặt lại mật khẩu
            </H3>
            <Box onSubmit={formik.handleSubmit} component="form" display="flex" flexDirection="column" gap={2}>
                <TextField
                    fullWidth
                    name="email"
                    type="email"
                    label="Email"
                    onBlur={formik.handleBlur}
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    helperText={formik.touched.email && formik.errors.email}
                    error={Boolean(formik.touched.email && formik.errors.email)}
                />

                <Button
                    sx={{ textTransform: "none" }}
                    fullWidth
                    type="submit"
                    color="primary"
                    variant="contained"
                    disabled={loading}
                >
                    {loading
                        ? "Đang xử lý..."
                        : isSubmitted
                            ? "Gửi lại yêu cầu"
                            : "Gửi yêu cầu đặt lại mật khẩu"}
                </Button>
            </Box>

            <FlexCenterRow mt={3} justifyContent="center" gap={1}>
                Bạn chưa có tài khoản?
                <LinkBox title="Đăng ký ngay" href="/register" />
            </FlexCenterRow>
        </Fragment>
    );
};
