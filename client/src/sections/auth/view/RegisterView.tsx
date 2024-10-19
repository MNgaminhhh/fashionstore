"use client";

import { useState } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { useFormik } from "formik";
import * as yup from "yup";
import usePasswordVisible from "../hook/usePasswordVisible";
import EyeToggle from "../components/EyeToggle";
import MTField from "../../../components/MTField";
import Auth from "../../../services/Auth";
import { notifyError, notifySuccess } from "../../../utils/ToastNotification";
import { useRouter } from "next/navigation";

interface RegisterFormValue {
    name: string;
    email: string;
    password: string;
    confirm_password: string;
}

export const RegisterView = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const createInputProps = (visible, toggleVisible) => ({
        endAdornment: <EyeToggle show={visible} click={toggleVisible} />,
    });

    const { visible: visiblePassword, toggleVisible: togglePasswordVisible } =
        usePasswordVisible();
    const {
        visible: visibleConfirmPassword,
        toggleVisible: toggleConfirmPasswordVisible,
    } = usePasswordVisible();

    const initialValues: RegisterFormValue = {
        name: "",
        email: "",
        password: "",
        confirm_password: "",
    };

    const validationSchema = yup.object({
        name: yup.string().required("Vui lòng nhập tên"),
        email: yup
            .string()
            .email("Email không hợp lệ")
            .required("Vui lòng nhập email"),
        password: yup
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
            .oneOf([yup.ref("password"), null], "Mật khẩu nhập lại không khớp")
            .required("Vui lòng nhập lại mật khẩu"),
    });

    const formik = useFormik<RegisterFormValue>({
        initialValues,
        validationSchema,
        onSubmit: async (values) => {
            setLoading(true);
            try {
                const response = await Auth.register(
                    values.email,
                    values.password,
                    values.confirm_password
                );
                if (response.data.success) {
                    notifySuccess(
                        "Đăng ký thành công. Vui lòng kiểm tra email để xác thực tài khoản!"
                    );
                    formik.resetForm();
                    await router.push("/login");
                } else {
                    notifyError(response.data.message);
                }
            } catch (error) {
                notifyError("Có lỗi xảy ra trong quá trình đăng ký!");
            } finally {
                setLoading(false);
            }
        },
    });

    const fields = [
        {
            name: "name",
            label: "Họ và tên",
            type: "text",
            value: formik.values.name,
            error: formik.errors.name,
            touched: formik.touched.name,
        },
        {
            name: "email",
            label: "Email",
            type: "email",
            value: formik.values.email,
            error: formik.errors.email,
            touched: formik.touched.email,
        },
        {
            name: "password",
            label: "Mật khẩu",
            type: visiblePassword ? "text" : "password",
            value: formik.values.password,
            error: formik.errors.password,
            touched: formik.touched.password,
            inputProps: createInputProps(visiblePassword, togglePasswordVisible),
        },
        {
            name: "confirm_password",
            label: "Nhập lại mật khẩu",
            type: visibleConfirmPassword ? "text" : "password",
            value: formik.values.confirm_password,
            error: formik.errors.confirm_password,
            touched: formik.touched.confirm_password,
            inputProps: createInputProps(
                visibleConfirmPassword,
                toggleConfirmPasswordVisible
            ),
        },
    ];

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <form onSubmit={formik.handleSubmit}>
            {fields.map((field, index) => (
                <MTField
                    key={index}
                    fullWidth
                    mb={1.5}
                    size="small"
                    variant="outlined"
                    name={field.name}
                    label={field.label}
                    type={field.type}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={field.value}
                    error={!!field.touched && !!field.error}
                    helperText={field.touched && field.error}
                    InputProps={field.inputProps}
                    placeholder={field.label}
                />
            ))}
            <Button
                sx={{ textTransform: "none" }}
                fullWidth
                type="submit"
                color="primary"
                variant="contained"
                size="large"
            >
                Tạo tài khoản
            </Button>
        </form>
    );
};
