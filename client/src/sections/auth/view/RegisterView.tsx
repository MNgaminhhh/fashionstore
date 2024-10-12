"use client";

import Button from "@mui/material/Button";
import { useFormik } from "formik";
import * as yup from "yup";
import usePasswordVisible from "../hook/usePasswordVisible";
import EyeToggle from "../components/EyeToggle";
import MTField from "../../../components/MTField";
import Auth from "../../../services/Auth";
import {router} from "next/client";
import {notifyError, notifySuccess} from "../../../utils/ToastNotification";

export const RegisterView = () => {
    const createInputProps = (visible, toggleVisible) => ({
        endAdornment: <EyeToggle show={visible} click={toggleVisible} />,
    });

    const { visible: visiblePassword, toggleVisible: togglePasswordVisible } = usePasswordVisible();
    const { visible: visibleConfirmPassword, toggleVisible: toggleConfirmPasswordVisible } = usePasswordVisible();

    const initialValues = {
        name: "",
        email: "",
        password: "",
        confirm_password: "",
    };

    const validationSchema = yup.object({
        name: yup.string().required("Vui lòng nhập tên"),
        email: yup.string().email("Email không hợp lệ").required("Vui lòng nhập email"),
        password: yup.string().required("Vui lòng nhập mật khẩu"),
        confirm_password: yup
            .string()
            .oneOf([yup.ref("password"), null], "Mật khẩu nhập lại không khớp")
            .required("Vui lòng nhập lại mật khẩu"),
    });

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: async (values) => {
            try {
                const response = await Auth.register(values.email, values.password, values.confirm_password);

                if (response.data.success) {
                    notifySuccess("Đăng ký thành công!");
                    formik.resetForm();
                    await router.push("/login");
                } else {
                    notifyError(response.data.message);
                }
            } catch (error) {
                notifyError("Có lỗi xảy ra trong quá trình đăng ký!");
            }
        },
    });

    const fields = [
        { name: "name", label: "Họ và tên", type: "text", value: formik.values.name, error: formik.errors.name, touched: formik.touched.name },
        { name: "email", label: "Email", type: "email", value: formik.values.email, error: formik.errors.email, touched: formik.touched.email },
        { name: "password", label: "Mật khẩu", type: visiblePassword ? "text" : "password", value: formik.values.password, error: formik.errors.password, touched: formik.touched.password, inputProps: createInputProps(visiblePassword, togglePasswordVisible) },
        { name: "confirm_password", label: "Nhập lại mật khẩu", type: visibleConfirmPassword ? "text" : "password", value: formik.values.confirm_password, error: formik.errors.confirm_password, touched: formik.touched.confirm_password, inputProps: createInputProps(visibleConfirmPassword, toggleConfirmPasswordVisible) },
    ];

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
            <Button fullWidth type="submit" color="primary" variant="contained" size="large">
                Tạo tài khoản
            </Button>
        </form>
    );
};
