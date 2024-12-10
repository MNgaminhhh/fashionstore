"use client";

import Button from "@mui/material/Button";
import * as yup from "yup";
import MTField from "../../../components/MTField";
import usePasswordVisible from "../hook/usePasswordVisible";
import EyeToggle from "../components/EyeToggle";
import { useFormik } from "formik";
import Auth from "../../../services/Auth";
import { notifyError, notifySuccess } from "../../../utils/ToastNotification";
import { useRouter } from "next/navigation";
import { useAppContext } from "../../../context/AppContext";
import { get } from "lodash";
import Cart from "../../../services/Cart";
interface LoginViewProps {
  closeDialog?: () => void;
}

interface LoginFormValues {
  email: string;
  password: string;
}

export const LoginView = ({ closeDialog }: LoginViewProps) => {
  const { visible, toggleVisible } = usePasswordVisible();
  const router = useRouter();
  const { setSessionToken, setCart } = useAppContext();
  const fields = [
    {
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "test@email.com",
      validation: yup
        .string()
        .email("Email không đúng định dạng ..@..!")
        .required("Email không được để trống!"),
    },
    {
      name: "password",
      label: "Password",
      type: visible ? "text" : "password",
      placeholder: "*********",
      validation: yup.string().required("Password không được để trống!"),
      inputProps: {
        endAdornment: <EyeToggle show={visible} click={toggleVisible} />,
      },
    },
  ];

  const initialValues: LoginFormValues = { email: "", password: "" };
  const validationSchema = yup.object().shape(
    fields.reduce((schema, field) => {
      schema[field.name] = field.validation;
      return schema;
    }, {})
  );

  const formik = useFormik<LoginFormValues>({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await Auth.login(values.email, values.password);
        if (response.data.success) {
          notifySuccess("Đăng nhập thành công!");
          const token = get(response, "data.data.access_token", true);
          setSessionToken(token);
          const cartCount = await Cart.getAllCart(token);
          if (cartCount?.success || cartCount?.data?.success) {
            const cartItemCount = cartCount?.data?.length || 0;
            setCart(cartItemCount);
          }

          formik.resetForm();
          router.push("/");
        } else {
          notifyError(response.data.message);
        }
      } catch (error) {
        console.log(error);
        notifyError("Có lỗi xảy ra trong quá trình đăng nhập!");
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      {fields.map((field, index) => (
        <MTField
          key={index}
          mb={index === 0 ? 1.5 : 2}
          fullWidth
          name={field.name}
          size="small"
          type={field.type}
          variant="outlined"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          value={formik.values[field.name]}
          label={field.label}
          placeholder={field.placeholder}
          helperText={formik.touched[field.name] && formik.errors[field.name]}
          error={Boolean(
            formik.touched[field.name] && formik.errors[field.name]
          )}
          InputProps={field.inputProps}
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
        Đăng Nhập
      </Button>
    </form>
  );
};
