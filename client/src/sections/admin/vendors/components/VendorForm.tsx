"use client";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import { Formik } from "formik";
import * as yup from "yup";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import MTImage from "../../../../components/MTImage";
import {
  notifyError,
  notifySuccess,
} from "../../../../utils/ToastNotification";
import { useRouter } from "next/navigation";
import Vendor from "../../../../services/Vendor";
import { useAppContext } from "../../../../context/AppContext";

const VALIDATION_SCHEMA = yup.object().shape({
  status: yup.string().required("Trạng thái là bắt buộc"),
});

type Props = {
  vendor: {
    store_name: string;
    user_id: string;
    full_name: string;
    phone_number: string;
    description: string;
    status: string;
    banner: string;
  };
};

export default function VendorForm({ vendor }: Props) {
  const router = useRouter();
  const INITIAL_VALUES = {
    store_name: vendor.store_name || "",
    user_id: vendor.user_id || "",
    full_name: vendor.full_name || "",
    phone_number: vendor.phone_number || "",
    description: vendor.description || "",
    status: vendor.status || "active",
    banner: vendor.banner || "",
  };

  const { sessionToken } = useAppContext();
  const handleFormSubmit = async (values: any) => {
    try {
      const response = await Vendor.updateStatus(
        {
          user_id: values.user_id,
          status: values.status,
        },
        sessionToken
      );
      if (response && response.success) {
        notifySuccess("Cập nhật trạng thái thành công!");
        router.push("/dashboard/admin/vendors");
        router.refresh();
      } else {
        notifyError(
          "Cập nhật thất bại:" + response?.message || "Vui lòng thử lại sau!"
        );
      }
    } catch (error: any) {
      notifyError(`Lỗi: ${error?.message || "Không thể kết nối với server"}`);
    }
  };

  const disabledTextFieldStyles = {
    "& .MuiInputBase-input.Mui-disabled": {
      WebkitTextFillColor: "#000000",
      opacity: 1,
    },
  };

  return (
    <Card sx={{ p: 4, mx: "auto", boxShadow: 3 }}>
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={INITIAL_VALUES}
        validationSchema={VALIDATION_SCHEMA}
        enableReinitialize
      >
        {({ values, handleChange, handleSubmit }) => {
          const isStatusChanged = values.status !== INITIAL_VALUES.status;

          return (
            <form onSubmit={handleSubmit}>
              <Typography variant="h4" mb={2} textAlign="center">
                Thông tin cửa hàng
              </Typography>
              <Divider sx={{ mb: 4 }} />
              <Box textAlign="center" mb={4}>
                <Typography variant="h6" mb={1}>
                  Banner Cửa Hàng
                </Typography>
                <Card
                  sx={{
                    p: 2,
                    display: "inline-block",
                    borderRadius: 2,
                    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <MTImage
                    src={values.banner}
                    alt={values.store_name || "Banner cửa hàng"}
                    width={600}
                    height={200}
                    sx={{ borderRadius: 2 }}
                  />
                </Card>
              </Box>

              <Box mb={4}>
                <Typography variant="h6" mb={2}>
                  Thông tin cơ bản
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      name="store_name"
                      label="Tên cửa hàng"
                      value={values.store_name}
                      disabled
                      sx={disabledTextFieldStyles}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      name="full_name"
                      label="Họ và tên"
                      value={values.full_name}
                      disabled
                      sx={disabledTextFieldStyles}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      name="phone_number"
                      label="Số điện thoại"
                      value={values.phone_number}
                      disabled
                      sx={disabledTextFieldStyles}
                    />
                  </Grid>
                </Grid>
              </Box>
              <Box mb={4}>
                <Typography variant="h6" mb={2}>
                  Mô tả cửa hàng
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={20}
                  name="description"
                  value={values.description}
                  disabled
                  sx={disabledTextFieldStyles}
                />
              </Box>
              <Box mb={4}>
                <Typography variant="h6" mb={2} color="primary">
                  Cập nhật trạng thái
                </Typography>
                <TextField
                  select
                  fullWidth
                  name="status"
                  label="Trạng thái"
                  value={values.status}
                  onChange={handleChange}
                  sx={{
                    "& .MuiSelect-select": {
                      backgroundColor: "#e3f2fd",
                      fontWeight: "bold",
                      color: "#1976d2",
                    },
                  }}
                >
                  <MenuItem value="accepted">Hoạt động</MenuItem>
                  <MenuItem value="rejected">Từ chối</MenuItem>
                  <MenuItem value="pending">Đang chờ duyệt</MenuItem>
                </TextField>
              </Box>
              <Box textAlign="center">
                <Button
                  variant="outlined"
                  color="secondary"
                  sx={{ px: 4, py: 1, mr: 2 }}
                  onClick={() => router.push("/dashboard/admin/vendors")}
                >
                  Trở về
                </Button>

                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  sx={{ px: 4, py: 1 }}
                  disabled={!isStatusChanged}
                >
                  Lưu trạng thái
                </Button>
              </Box>
            </form>
          );
        }}
      </Formik>
    </Card>
  );
}
