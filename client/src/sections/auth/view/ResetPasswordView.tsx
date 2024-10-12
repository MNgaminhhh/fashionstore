"use client";
import { Fragment } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useFormik } from "formik";
import * as yup from "yup";
import {H3} from "../../../components/Typography";
import LinkBox from "../components/LinkBox";
import {FlexCenterRow} from "../../../components/flexbox";

export const ResetPasswordView = () => {
    const initialValues = { email: "" };
    const validation = yup.object().shape({
        email: yup.string().email("Email không hợp lệ").required("Vui lòng nhập email"),
    });

    const { values,
        errors,
        touched,
        handleBlur,
        handleChange,
        handleSubmit
    } = useFormik({
        initialValues,
        validation,
        onSubmit: (values) => {
            console.log(values);
        },
    });

    return (
        <Fragment>
            <H3 mb={3} textAlign="center">
                Đặt lại mật khẩu của bạn
            </H3>
            <Box onSubmit={handleSubmit} component="form" display="flex" flexDirection="column" gap={2}>
                <TextField
                    fullWidth
                    name="email"
                    type="email"
                    label="Email"
                    onBlur={handleBlur}
                    value={values.email}
                    onChange={handleChange}
                    helperText={touched.email && errors.email}
                    error={Boolean(touched.email && errors.email)}
                />

                <Button fullWidth type="submit" color="primary" variant="contained">
                    Đặt lại mật khẩu
                </Button>
            </Box>

            <FlexCenterRow mt={3} justifyContent="center" gap={1}>
                Bạn chưa có tài khoản?
                <LinkBox title="Đăng ký ngay" href="/register" />
            </FlexCenterRow>
        </Fragment>
    );
};
