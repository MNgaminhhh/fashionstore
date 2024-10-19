"use client";

import { Fragment, useState, useEffect } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { useFormik } from "formik";
import * as yup from "yup";
import { H3 } from "../../../components/Typography";
import LinkBox from "../components/LinkBox";
import { FlexCenterRow } from "../../../components/flexbox";
import Auth from "../../../services/Auth";
import { useRouter, useSearchParams } from "next/navigation";
import { notifyError, notifySuccess } from "../../../utils/ToastNotification";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { decodeToken } from "../../../utils/decodeToken";
import EyeToggle from "../components/EyeToggle";
import usePasswordVisible from "../hook/usePasswordVisible";

interface ResetPasswordFormValue {
    new_password: string;
    confirm_password: string;
}

export const ResetPasswordView = () => {
    const [loading, setLoading] = useState(false);
    const [tokenValid, setTokenValid] = useState(null);
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const createInputProps = (visible, toggleVisible) => ({
        endAdornment: <EyeToggle show={visible} click={toggleVisible} />,
    });
    const { visible: visiblePassword, toggleVisible: togglePasswordVisible } =
        usePasswordVisible();
    const {
        visible: visibleConfirmPassword,
        toggleVisible: toggleConfirmPasswordVisible,
    } = usePasswordVisible();

    useEffect(() => {
        if (!token) {
            notifyError("Không tìm thấy token. Vui lòng thử lại.");
            setTokenValid(false);
            return;
        }

        const { valid } = decodeToken(token);
        if (!valid) {
            setTokenValid(false);
        } else {
            setTokenValid(true);
        }
    }, [token]);

    const initialValues: ResetPasswordFormValue = {
        new_password: "",
        confirm_password: "",
    };

    const validationSchema = yup.object().shape({
        new_password: yup
            .string()
            .required("Vui lòng nhập mật khẩu")
            .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
            .matches(/[A-Z]/, "Mật khẩu phải có ít nhất một chữ hoa")
            .matches(/[a-z]/, "Mật khẩu phải có ít nhất một chữ thường")
            .matches(/\d/, "Mật khẩu phải có ít nhất một chữ số")
            .matches(
                /[!@#$%^&*(),.?":{}|<>]/,
                "Mật khẩu phải có ít nhất một ký tự đặc biệt"
            ),
        confirm_password: yup
            .string()
            .oneOf([yup.ref("new_password"), null], "Mật khẩu nhập lại không khớp")
            .required("Vui lòng nhập lại mật khẩu"),
    });

    const formik = useFormik<ResetPasswordFormValue>({
        initialValues,
        validationSchema,
        onSubmit: async (values) => {
            setLoading(true);
            if (!token) {
                notifyError("URL không hợp lệ hoặc đã hết hạn.");
                setLoading(false);
                return;
            }

            try {
                const response = await Auth.resetPassword(
                    values.new_password,
                    values.confirm_password,
                    token
                );
                if (response.data.success) {
                    notifySuccess("Đặt lại mật khẩu thành công!");
                    formik.resetForm();
                    router.push("/login");
                } else {
                    notifyError(response.data.message || "Đặt lại mật khẩu thất bại.");
                }
            } catch (error) {
                notifyError("Đã xảy ra lỗi trong quá trình đặt lại mật khẩu.");
            } finally {
                setLoading(false);
            }
        },
    });

    if (tokenValid === null) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center">
                <CircularProgress />
            </Box>
        );
    }

    if (!tokenValid) {
        return (
            <Fragment>
                <H3 mb={3} textAlign="center">
                    Token đã hết hạn hoặc không hợp lệ.
                </H3>
                <FlexCenterRow justifyContent="center">
                    <LinkBox title="Quay về trang chủ" href="/" />
                </FlexCenterRow>
            </Fragment>
        );
    }

    return (
        <Fragment>
            <H3 mb={3} textAlign="center">
                Đặt lại mật khẩu của bạn
            </H3>
            <Box onSubmit={formik.handleSubmit} component="form" display="flex" flexDirection="column" gap={2}>
                <TextField
                    fullWidth
                    name="new_password"
                    type={visiblePassword ? "text" : "password"}
                    label="Mật khẩu mới"
                    onBlur={formik.handleBlur}
                    value={formik.values.new_password}
                    onChange={formik.handleChange}
                    helperText={formik.touched.new_password && formik.errors.new_password}
                    error={Boolean(formik.touched.new_password && formik.errors.new_password)}
                    InputProps={createInputProps(visiblePassword, togglePasswordVisible)}
                />
                <TextField
                    fullWidth
                    name="confirm_password"
                    type={visibleConfirmPassword ? "text" : "password"}
                    label="Xác nhận mật khẩu"
                    onBlur={formik.handleBlur}
                    value={formik.values.confirm_password}
                    onChange={formik.handleChange}
                    helperText={formik.touched.confirm_password && formik.errors.confirm_password}
                    error={Boolean(formik.touched.confirm_password && formik.errors.confirm_password)}
                    InputProps={createInputProps(
                        visibleConfirmPassword,
                        toggleConfirmPasswordVisible
                    )}
                />

                <Button
                    sx={{ textTransform: "none" }}
                    fullWidth
                    type="submit"
                    color="primary"
                    variant="contained"
                    disabled={loading}
                >
                    {loading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
                </Button>
            </Box>

            <FlexCenterRow mt={3} justifyContent="center" gap={1}>
                Bạn chưa có tài khoản?
                <LinkBox title="Đăng ký ngay" href="/register" />
            </FlexCenterRow>
        </Fragment>
    );
};