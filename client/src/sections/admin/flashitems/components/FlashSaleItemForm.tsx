"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  Button,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CircularProgress,
  Grid,
  Autocomplete,
  TextField as MUITextField,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FlashSaleItemModel from "../../../../models/FlashSaleItem.model";
import ProductModel from "../../../../models/Product.model";
import FlashSaleItem from "../../../../services/FlashSaleItem";
import {
  notifyError,
  notifySuccess,
} from "../../../../utils/ToastNotification";

type Props = {
  flashSaleItem?: FlashSaleItemModel;
  products: ProductModel[];
  token: string;
};

const FlashSaleItemSchema = Yup.object().shape({
  product_id: Yup.string().required("Chọn sản phẩm là bắt buộc"),
  show: Yup.boolean().required("Trạng thái hiển thị là bắt buộc"),
});

const INITIAL_VALUES = (flashSaleItem?: FlashSaleItemModel) => ({
  id: flashSaleItem?.id || "",
  flash_sale_id: flashSaleItem?.flash_sale_id || "",
  product_id: flashSaleItem?.product_id || "",
  show: flashSaleItem?.show || false,
});

export default function FlashSaleItemForm({
  flashSaleItem,
  products,
  token,
}: Props) {
  console.log(flashSaleItem);
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const [isFormChanged, setIsFormChanged] = useState(false);
  const [loading, setLoading] = useState(false);
  const flashSaleId = Array.isArray(id) ? id[0] : id;

  const handleSubmit = async (
    values: typeof INITIAL_VALUES,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    setLoading(true);
    try {
      const flashSaleItemData: Omit<FlashSaleItemModel, "id"> = {
        flash_sale_id: flashSaleId,
        product_id: values.product_id,
        show: values.show,
      };

      let response;

      if (flashSaleItem) {
        response = await FlashSaleItem.update(
          flashSaleItem.id,
          flashSaleItemData,
          token
        );
        if (response.data.success) {
          notifySuccess("Cập nhật Flash Sale Item thành công!");
        } else {
          notifyError(
            "Cập nhật Flash Sale Item thất bại: " +
              (response.data.message || "Vui lòng thử lại.")
          );
          return;
        }
      } else {
        response = await FlashSaleItem.create(flashSaleItemData, token);
        if (response.data.success) {
          notifySuccess("Tạo mới Flash Sale Item thành công!");
        } else {
          notifyError(
            "Tạo mới Flash Sale Item thất bại: " +
              (response.data.message || "Vui lòng thử lại!")
          );
          return;
        }
      }

      router.push(`/dashboard/admin/flash-sale/${flashSaleId}/flash-items`);
      router.refresh();
    } catch (error: any) {
      console.error("Error:", error);
      notifyError("Có lỗi xảy ra khi gửi dữ liệu.");
    } finally {
      setSubmitting(false);
      setLoading(false);
      setIsFormChanged(false);
    }
  };

  return (
    <Card sx={{ p: 4, mx: "auto", boxShadow: 3 }}>
      <Formik
        initialValues={INITIAL_VALUES(flashSaleItem)}
        validationSchema={FlashSaleItemSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({
          values,
          errors,
          touched,
          setFieldValue,
          handleBlur,
          isSubmitting,
        }) => (
          <Form>
            <input
              type="hidden"
              name="flash_sale_id"
              value={flashSaleId as string}
            />

            <Grid container spacing={4}>
              <Grid item xs={12} sm={12}>
                <FormControl fullWidth>
                  <Autocomplete
                    options={products}
                    getOptionLabel={(option) => option.name}
                    value={
                      products.find(
                        (product) => product.id === values.product_id
                      ) || null
                    }
                    onChange={(event, newValue) => {
                      setFieldValue("product_id", newValue ? newValue.id : "");
                      setIsFormChanged(true);
                    }}
                    renderInput={(params) => (
                      <MUITextField
                        {...params}
                        label="Chọn Sản Phẩm"
                        variant="outlined"
                        onBlur={handleBlur}
                        error={Boolean(touched.product_id && errors.product_id)}
                        helperText={touched.product_id && errors.product_id}
                        InputProps={{
                          ...params.InputProps,
                          startAdornment: (
                            <InputAdornment position="start">
                              <SearchIcon />
                            </InputAdornment>
                          ),
                        }}
                      />
                    )}
                    disabled={loading}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                      },
                      "& .MuiAutocomplete-endAdornment": {
                        right: 0,
                      },
                    }}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={12}>
                <FormControl
                  fullWidth
                  variant="outlined"
                  color="info"
                  size="medium"
                  disabled={loading}
                  error={Boolean(touched.show && errors.show)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                >
                  <InputLabel id="show-label">Hiển Thị</InputLabel>
                  <Select
                    labelId="show-label"
                    id="show"
                    name="show"
                    value={values.show}
                    label="Hiển Thị"
                    onChange={(e) => {
                      setFieldValue("show", e.target.value as boolean);
                      setIsFormChanged(true);
                    }}
                    onBlur={handleBlur}
                  >
                    <MenuItem value={true}>Hiển Thị</MenuItem>
                    <MenuItem value={false}>Không Hiển Thị</MenuItem>
                  </Select>
                  {touched.show && errors.show && (
                    <Typography color="error" variant="caption">
                      {errors.show}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
            </Grid>
            <Box
              display="flex"
              justifyContent="flex-end"
              mt={6}
              alignItems="center"
            >
              <Button
                variant="outlined"
                color="secondary"
                onClick={() =>
                  router.push(
                    `/dashboard/admin/flash-sale/${flashSaleId}/flash-items`
                  )
                }
                sx={{
                  px: 4,
                  py: 1,
                  mr: 2,
                  textTransform: "none",
                  borderRadius: 2,
                }}
                disabled={loading}
              >
                Trở về
              </Button>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={!isFormChanged || isSubmitting || loading}
                sx={{
                  px: 4,
                  py: 1,
                  textTransform: "none",
                  borderRadius: 2,
                }}
              >
                {loading ? (
                  <>
                    <CircularProgress
                      size={24}
                      color="inherit"
                      sx={{ mr: 1 }}
                    />
                    Đang tải...
                  </>
                ) : flashSaleItem ? (
                  "Cập Nhật"
                ) : (
                  "Thêm Mới"
                )}
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Card>
  );
}
