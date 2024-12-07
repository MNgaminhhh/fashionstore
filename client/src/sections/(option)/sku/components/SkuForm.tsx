"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Formik, Form, FieldArray } from "formik";
import * as Yup from "yup";
import {
  TextField,
  Button,
  Box,
  Typography,
  Card,
  CircularProgress,
  Slider,
  Grid,
  Chip,
  IconButton,
  Paper,
  Divider,
  MenuItem,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import {
  notifyError,
  notifySuccess,
} from "../../../../utils/ToastNotification";
import Skus from "../../../../services/Skus";
import OptionVariant from "../../../../services/OptionVariant";
import SkuModel from "../../../../models/Sku.model";
import VariantModel from "../../../../models/Variant.model";

type Props = {
  sku?: SkuModel;
  variOp: VariantModel[];
  token: string;
};

const SkuSchema = Yup.object().shape({
  sku: Yup.string().required("Mã sản phẩm là bắt buộc"),
  price: Yup.number()
    .typeError("Giá phải là một số")
    .positive("Giá phải lớn hơn 0")
    .required("Giá là bắt buộc"),
  in_stock: Yup.string().required("Số lượng là bắt buộc"),
  status: Yup.string()
    .oneOf(["active", "inactive"], "Trạng thái không hợp lệ")
    .required("Trạng thái là bắt buộc"),
  variants: Yup.array()
    .of(
      Yup.object().shape({
        variant: Yup.object().nullable().required("Biến thể là bắt buộc"),
        variant_option: Yup.object()
          .nullable()
          .required("Chi tiết biến thể là bắt buộc"),
      })
    )
    .min(1, "Bạn phải thêm ít nhất một biến thể"),
  offer: Yup.number()
    .min(0, "Giảm giá phải từ 0%")
    .max(100, "Giảm giá không được vượt quá 100%")
    .required("Giảm giá là bắt buộc"),
  offer_start_date: Yup.date().when("offer", {
    is: (offer: number) => offer > 0,
    then: (schema) =>
      schema
        .required("Ngày bắt đầu khuyến mãi là bắt buộc")
        .typeError("Ngày bắt đầu khuyến mãi không hợp lệ"),
    otherwise: (schema) => schema.notRequired(),
  }),
  offer_end_date: Yup.date().when("offer", {
    is: (offer: number) => offer > 0,
    then: (schema) =>
      schema
        .required("Ngày kết thúc khuyến mãi là bắt buộc")
        .typeError("Ngày kết thúc khuyến mãi không hợp lệ")
        .min(
          Yup.ref("offer_start_date"),
          "Ngày kết thúc phải sau ngày bắt đầu"
        ),
    otherwise: (schema) => schema.notRequired(),
  }),
});

const INITIAL_VALUES = (sku?: SkuModel, variOp?: VariantModel[]) => ({
  sku: sku?.sku || "",
  price: sku?.price || 0,
  in_stock: sku?.in_stock || "",
  status: sku?.status || "inactive",
  variants: sku
    ? sku.variant_options.map((variantOptionId) => {
        const variantOption = variOp?.find((op) => op.id === variantOptionId);
        return {
          variant: variantOption ? variantOption.variant : null,
          variant_option: variantOption || null,
        };
      })
    : [
        {
          variant: null,
          variant_option: null,
        },
      ],
  offer: sku?.offer || 0,
  offer_start_date: sku?.offer_start_date
    ? new Date(sku.offer_start_date).toISOString().slice(0, 16)
    : "",
  offer_end_date: sku?.offer_end_date
    ? new Date(sku.offer_end_date).toISOString().slice(0, 16)
    : "",
});

export default function SkuForm({ sku, variOp, token }: Props) {
  console.log(sku);
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const [isFormChanged, setIsFormChanged] = useState(false);
  const [loading, setLoading] = useState(false);
  const productId = Array.isArray(id) ? id[0] : id;

  const [variantOptions, setVariantOptions] = useState<{
    [key: number]: VariantModel[];
  }>({});

  useEffect(() => {
    if (sku && sku.variant_options.length > 0 && variOp) {
      sku.variant_options.forEach(async (variantOptionId, index) => {
        try {
          const response = await OptionVariant.getVariantByOptionId(
            variantOptionId,
            token
          );
          if (response.success && response.data.variant_option) {
            setVariantOptions((prev) => ({
              ...prev,
              [index]: [response.data.variant_option],
            }));
          } else {
            notifyError(
              "Không thể tải danh sách tùy chọn biến thể: " +
                (response.message || "Vui lòng thử lại.")
            );
          }
        } catch (error) {
          notifyError("Có lỗi xảy ra khi tải danh sách tùy chọn biến thể.");
        }
      });
    }
  }, [sku, token, variOp]);

  const handleSubmit = async (
    values: ReturnType<typeof INITIAL_VALUES>,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    setLoading(true);
    try {
      const variantOptionIds = values.variants
        .map((variant) => variant.variant_option?.id)
        .filter((id): id is string => !!id);
      const formatDate = (dateStr: string): string => {
        const date = new Date(dateStr);

        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");

        return `${day}-${month}-${year} ${hours}:${minutes}`;
      };
      const skuData: Partial<SkuModel> = {
        sku: values.sku,
        price: values.price,
        in_stock: values.in_stock,
        offer: values.offer,
        variant_options: variantOptionIds,
        status: values.status,
        offer_start_date:
          values.offer > 0 ? formatDate(values.offer_start_date) : undefined,
        offer_end_date:
          values.offer > 0 ? formatDate(values.offer_end_date) : undefined,
        product_id: productId,
      };

      let response;

      if (sku) {
        response = await Skus.update(sku.id, skuData, token, true);
        if (response.data.success) {
          notifySuccess("Cập nhật SKU thành công!");
        } else {
          notifyError(
            "Cập nhật SKU thất bại: " +
              (response.data.message || "Vui lòng thử lại.")
          );
          return;
        }
      } else {
        response = await Skus.create(skuData, token, true);
        if (response.data.success) {
          notifySuccess("Tạo mới SKU thành công!");
        } else {
          notifyError(
            "Tạo mới SKU thất bại: " +
              (response.data.message || "Vui lòng thử lại!")
          );
          return;
        }
      }

      router.push(`/dashboard/vendor/product/${productId}/sku`);
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

  const handleVariantChange = async (
    index: number,
    variant: VariantModel | null,
    setFieldValue: any
  ) => {
    setFieldValue(`variants.${index}.variant`, variant);
    setFieldValue(`variants.${index}.variant_option`, null);
    setIsFormChanged(true);

    if (variant) {
      try {
        const response = await OptionVariant.getListOpVariant(
          variant.id,
          token
        );
        if (response.success) {
          setVariantOptions((prev) => ({
            ...prev,
            [index]: response.data.results,
          }));
        } else {
          notifyError(
            "Không thể tải danh sách tùy chọn biến thể: " +
              (response.message || "Vui lòng thử lại.")
          );
        }
      } catch (error) {
        notifyError("Có lỗi xảy ra khi tải danh sách tùy chọn biến thể.");
      }
    } else {
      setVariantOptions((prev) => ({
        ...prev,
        [index]: [],
      }));
    }
  };

  return (
    <Card sx={{ p: 4, mx: "auto", boxShadow: 3, maxWidth: 1200 }}>
      <Formik
        initialValues={INITIAL_VALUES(sku, variOp)}
        validationSchema={SkuSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          setFieldValue,
          isSubmitting,
        }) => (
          <Form>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Paper elevation={3} sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Thông Tin SKU
                  </Typography>
                  <Divider sx={{ mb: 3 }} />

                  <Grid container spacing={3}>
                    <Grid item sm={6} xs={12}>
                      <TextField
                        fullWidth
                        name="sku"
                        label="Mã SKU"
                        color="info"
                        size="medium"
                        value={values.sku}
                        onBlur={handleBlur}
                        onChange={(e) => {
                          handleChange(e);
                          setIsFormChanged(true);
                        }}
                        helperText={touched.sku && errors.sku}
                        error={Boolean(touched.sku && errors.sku)}
                        disabled={loading}
                      />
                    </Grid>

                    <Grid item sm={6} xs={12}>
                      <TextField
                        fullWidth
                        name="price"
                        label="Giá"
                        type="number"
                        color="info"
                        size="medium"
                        value={values.price}
                        onBlur={handleBlur}
                        onChange={(e) => {
                          handleChange(e);
                          setIsFormChanged(true);
                        }}
                        helperText={touched.price && errors.price}
                        error={Boolean(touched.price && errors.price)}
                        disabled={loading}
                        inputProps={{ min: 0, step: 0.01 }}
                      />
                    </Grid>

                    <Grid item sm={6} xs={12}>
                      <TextField
                        fullWidth
                        name="in_stock"
                        label="Số Lượng"
                        type="number"
                        color="info"
                        size="medium"
                        value={values.in_stock}
                        onBlur={handleBlur}
                        onChange={(e) => {
                          handleChange(e);
                          setIsFormChanged(true);
                        }}
                        helperText={touched.in_stock && errors.in_stock}
                        error={Boolean(touched.in_stock && errors.in_stock)}
                        disabled={loading}
                        inputProps={{ min: 0, step: 1 }}
                      />
                    </Grid>

                    <Grid item sm={6} xs={12}>
                      <TextField
                        select
                        fullWidth
                        name="status"
                        label="Trạng thái"
                        color="info"
                        size="medium"
                        value={values.status}
                        onBlur={handleBlur}
                        onChange={(e) => {
                          handleChange(e);
                          setIsFormChanged(true);
                        }}
                        helperText={touched.status && errors.status}
                        error={Boolean(touched.status && errors.status)}
                        disabled={loading}
                      >
                        <MenuItem value="active">Hiển Thị</MenuItem>
                        <MenuItem value="inactive">Ẩn</MenuItem>
                      </TextField>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>

              <Grid item xs={12}>
                <Card
                  sx={{
                    p: 3,
                    border: "1px solid #e0e0e0",
                    borderRadius: 2,
                    backgroundColor: "#f9f9f9",
                  }}
                >
                  <Typography variant="h6" gutterBottom>
                    Ưu Đãi
                  </Typography>
                  <Divider sx={{ mb: 3 }} />

                  <Grid container spacing={3}>
                    <Grid item sm={12} xs={12}>
                      <Typography gutterBottom>
                        Giảm giá: {values.offer}%
                      </Typography>
                      <Slider
                        value={values.offer}
                        onChange={(event, newValue) => {
                          setFieldValue("offer", newValue);
                          setIsFormChanged(true);
                        }}
                        aria-labelledby="offer-slider"
                        valueLabelDisplay="auto"
                        step={1}
                        marks
                        min={0}
                        max={100}
                        disabled={loading}
                      />
                      {touched.offer && errors.offer && (
                        <Typography color="error" variant="caption">
                          {errors.offer}
                        </Typography>
                      )}
                    </Grid>

                    {values.offer > 0 && (
                      <Grid item sm={6} xs={12}>
                        <TextField
                          fullWidth
                          name="offer_start_date"
                          label="Ngày Bắt Đầu Khuyến Mãi"
                          type="datetime-local"
                          color="info"
                          size="medium"
                          value={values.offer_start_date}
                          onBlur={handleBlur}
                          onChange={(e) => {
                            handleChange(e);
                            setIsFormChanged(true);
                          }}
                          helperText={
                            touched.offer_start_date && errors.offer_start_date
                          }
                          error={Boolean(
                            touched.offer_start_date && errors.offer_start_date
                          )}
                          disabled={loading}
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      </Grid>
                    )}

                    {values.offer > 0 && (
                      <Grid item sm={6} xs={12}>
                        <TextField
                          fullWidth
                          name="offer_end_date"
                          label="Ngày Kết Thúc Khuyến Mãi"
                          type="datetime-local"
                          color="info"
                          size="medium"
                          value={values.offer_end_date}
                          onBlur={handleBlur}
                          onChange={(e) => {
                            handleChange(e);
                            setIsFormChanged(true);
                          }}
                          helperText={
                            touched.offer_end_date && errors.offer_end_date
                          }
                          error={Boolean(
                            touched.offer_end_date && errors.offer_end_date
                          )}
                          disabled={loading}
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      </Grid>
                    )}
                  </Grid>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <FieldArray name="variants">
                  {({ push, remove }) => (
                    <div>
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        mb={2}
                      >
                        <Typography variant="h6">Biến Thể</Typography>
                        <Button
                          variant="outlined"
                          startIcon={<AddCircleOutlineIcon />}
                          onClick={() =>
                            push({ variant: null, variant_option: null })
                          }
                          disabled={loading}
                        >
                          Thêm Biến Thể
                        </Button>
                      </Box>
                      {values.variants.map((variantItem, index) => (
                        <Card
                          key={index}
                          sx={{
                            p: 3,
                            mb: 3,
                            border: "1px solid #e0e0e0",
                            borderRadius: 2,
                            backgroundColor: "#fafafa",
                          }}
                        >
                          <Grid container spacing={3} alignItems="center">
                            <Grid item sm={5} xs={12}>
                              <Autocomplete
                                options={variOp}
                                getOptionLabel={(option: VariantModel) =>
                                  option.name
                                }
                                value={variantItem.variant}
                                onChange={(event, newValue) => {
                                  handleVariantChange(
                                    index,
                                    newValue,
                                    setFieldValue
                                  );
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    label="Biến thể"
                                    placeholder="Chọn biến thể"
                                    error={Boolean(
                                      touched.variants &&
                                        touched.variants[index]?.variant &&
                                        errors.variants &&
                                        errors.variants[index]?.variant
                                    )}
                                    helperText={
                                      touched.variants &&
                                      touched.variants[index]?.variant &&
                                      errors.variants &&
                                      errors.variants[index]?.variant
                                    }
                                    disabled={loading}
                                  />
                                )}
                              />
                            </Grid>

                            <Grid item sm={5} xs={12}>
                              <Autocomplete
                                options={variantOptions[index] || []}
                                getOptionLabel={(option: VariantModel) =>
                                  option.name
                                }
                                value={variantItem.variant_option}
                                onChange={(event, newValue) => {
                                  setFieldValue(
                                    `variants.${index}.variant_option`,
                                    newValue
                                  );
                                  setIsFormChanged(true);
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    label="Chi tiết biến thể"
                                    placeholder="Chọn chi tiết biến thể"
                                    error={Boolean(
                                      touched.variants &&
                                        touched.variants[index]
                                          ?.variant_option &&
                                        errors.variants &&
                                        errors.variants[index]?.variant_option
                                    )}
                                    helperText={
                                      touched.variants &&
                                      touched.variants[index]?.variant_option &&
                                      errors.variants &&
                                      errors.variants[index]?.variant_option
                                    }
                                    disabled={
                                      loading || !values.variants[index].variant
                                    }
                                  />
                                )}
                                disabled={
                                  !values.variants[index].variant || loading
                                }
                              />
                            </Grid>

                            <Grid item sm={2} xs={12}>
                              <IconButton
                                color="error"
                                onClick={() => remove(index)}
                                disabled={loading}
                              >
                                <RemoveCircleOutlineIcon />
                              </IconButton>
                            </Grid>
                          </Grid>
                        </Card>
                      ))}
                    </div>
                  )}
                </FieldArray>
              </Grid>
            </Grid>

            <Box
              display="flex"
              justifyContent="flex-end"
              mt={4}
              alignItems="center"
            >
              <Button
                variant="outlined"
                color="secondary"
                onClick={() =>
                  router.push(`/dashboard/vendor/product/${productId}/sku`)
                }
                sx={{ px: 4, py: 1, mr: 2, textTransform: "none" }}
                disabled={loading}
              >
                Trở về
              </Button>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={!isFormChanged || isSubmitting || loading}
                sx={{ px: 4, py: 1, textTransform: "none" }}
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
                ) : sku ? (
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
