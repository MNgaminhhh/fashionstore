"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import {
    Card,
    Grid,
    Button,
    MenuItem,
    TextField,
    FormControlLabel,
    Switch,
    Typography,
    Slider,
    Divider, InputAdornment,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import * as Icons from "react-icons/fa";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Products from "../../../../services/Products";
import Vendor from "../../../../services/Vendor";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import Categories from "../../../../services/Categories";
import CategoriesModel from "../../../../models/Categories.model";
import { notifyError, notifySuccess } from "../../../../utils/ToastNotification";

interface ProductModel {
    id: string;
    name: string;
    sku: string;
    qty: number;
    price: string;
    product_type: string;
    is_approved: boolean;
    vendor_id: string;
    category_id: string;
    sub_category_id: string;
    child_category_id: string;
    short_description: string;
    long_description: string;
    offer: number;
    offer_start_date: Date | null;
    offer_end_date: Date | null;
}

const VALIDATION_SCHEMA = yup.object().shape({
    name: yup
    .string()
    .required("Tên sản phẩm là bắt buộc")
    .max(100, "Tên sản phẩm không được vượt quá 100 ký tự"),
    sku: yup
    .string()
    .required("SKU là bắt buộc")
    .max(50, "SKU không được vượt quá 50 ký tự"),
    qty: yup
    .number()
    .required("Số lượng là bắt buộc")
    .min(0, "Số lượng phải là số không âm"),
    price: yup
    .string()
    .required("Giá sản phẩm là bắt buộc")
    .matches(/^\d+(\.\d{1,2})?$/, "Giá phải là số hợp lệ"),
    product_type: yup.string().required("Loại sản phẩm là bắt buộc"),
    is_approved: yup.boolean().required("Trạng thái phê duyệt là bắt buộc"),
    category_id: yup.string().required("Danh mục là bắt buộc"),
    sub_category_id: yup.string().nullable(),
    child_category_id: yup.string().nullable(),
    short_description: yup
    .string()
    .max(500, "Mô tả ngắn không được vượt quá 500 ký tự"),
    long_description: yup.string(),
    offer: yup
    .number()
    .min(0, "Ưu đãi phải không âm")
    .max(100, "Ưu đãi không được vượt quá 100%"),
    offer_start_date: yup.date().nullable(),
    offer_end_date: yup
    .date()
    .nullable()
    .when("offer", {
        is: (offer: number) => offer > 0,
        then: (schema: yup.DateSchema<Date | null>) =>
            schema
            .min(
                yup.ref("offer_start_date"),
                "Ngày kết thúc ưu đãi phải sau ngày bắt đầu"
            )
            .required("Ngày kết thúc ưu đãi là bắt buộc khi có ưu đãi"),
        otherwise: (schema: yup.DateSchema<Date | null>) => schema.nullable(),
    }),
});

const availableIcons = Object.keys(Icons).filter((key) =>
    key.startsWith("Fa")
);

type Props = {
    cat: CategoriesModel;
    product: ProductModel;
};

export default function ProductForm({ product, cat }: Props) {
    const router = useRouter();
    const [isFormChanged, setIsFormChanged] = useState(false);
    const [categories, setCategories] = useState(cat || []);
    const [subCategories, setSubCategories] = useState<Array<{ id: string; name: string }>>([]);
    const [childCategories, setChildCategories] = useState<Array<{ id: string; name: string }>>([]);

    const fetchSubCategories = async (categoryId: string) => {
        try {
            const res = await Categories.getSubCategories(categoryId);
            if (res.data.success) {
                setSubCategories(res.data.data);
            }
        } catch (error) {
            notifyError("Không thể lấy danh sách sub-categories.");
        }
    };

    const fetchChildCategories = async (subCategoryId: string) => {
        try {
            const res = await Categories.getChildCategories(subCategoryId);
            if (res.data.success) {
                setChildCategories(res.data.data);
            }
        } catch (error) {
            notifyError("Không thể lấy danh sách child-categories.");
        }
    };

    const INITIAL_VALUES: ProductModel = {
        id: product?.id || "",
        name: product?.name || "",
        sku: product?.sku || "",
        qty: product?.qty || 0,
        price: product?.price || "",
        product_type: product?.product_type || "",
        is_approved: product?.is_approved || false,
        vendor_id: product?.vendor_id || "",
        category_id: product?.category_id || "",
        sub_category_id: product?.sub_category_id || "",
        child_category_id: product?.child_category_id || "",
        short_description: product?.short_description || "",
        long_description: product?.long_description || "",
        offer: product?.offer || 0,
        offer_start_date: product?.offer_start_date || null,
        offer_end_date: product?.offer_end_date || null,
    };

    const handleFormSubmit = async (values: ProductModel) => {
        try {
            const token = localStorage.getItem("token");
            if (product) {
                const res = await Products.update(product.id, values, token);
                if (res.data.success) {
                    notifySuccess("Thay đổi thông tin sản phẩm thành công!");
                    router.push("/admin/products");
                } else {
                    notifyError(
                        "Thay đổi thông tin sản phẩm thất bại: " + res.data.message
                    );
                }
            } else {
                const res = await Products.create(values, token);
                if (res.data.success) {
                    notifySuccess("Tạo sản phẩm mới thành công!");
                    router.push("/admin/products");
                } else {
                    notifyError("Tạo sản phẩm thất bại. Vui lòng thử lại sau!");
                }
            }
            setIsFormChanged(false);
        } catch (error) {
            notifyError("Có lỗi xảy ra. Vui lòng thử lại sau!");
        }
    };

    const handleFieldChange =
        (handleChange: any, setFieldValue: any) =>
            (
                event: React.ChangeEvent<
                    HTMLInputElement | { name?: string; value: unknown }
                >
            ) => {
                const { name, value } = event.target;
                if (name) {
                    setFieldValue(name, value);
                    setIsFormChanged(true);

                    if (name === "category_id") {
                        fetchSubCategories(value as string);
                        setFieldValue("sub_category_id", "");
                        setChildCategories([]);
                        setFieldValue("child_category_id", "");
                    }

                    if (name === "sub_category_id") {
                        fetchChildCategories(value as string);
                        setFieldValue("child_category_id", "");
                    }
                }
                handleChange(event);
            };

    const editorConfig = {
        buttonList: [
            ["undo", "redo"],
            ["bold", "italic", "underline", "strike"],
            ["font", "fontSize", "fontColor", "hiliteColor"],
            ["paragraphStyle", "blockquote"],
            ["align", "list", "lineHeight"],
            ["outdent", "indent"],
            ["table"],
            ["link", "image", "video"],
            ["fullScreen", "showBlocks", "codeView"],
            ["preview", "print"],
            ["removeFormat"],
        ],
        height: 500,
    };

    return (
        <Card sx={{ p: 4, mx: "auto", boxShadow: 3 }}>
            <Formik
                onSubmit={handleFormSubmit}
                initialValues={INITIAL_VALUES}
                validationSchema={VALIDATION_SCHEMA}
                enableReinitialize={false}
            >
                {({
                      values,
                      errors,
                      touched,
                      handleChange,
                      handleBlur,
                      handleSubmit,
                      setFieldValue,
                  }) => (
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            {/* Thông Tin Chung */}
                            <Grid item xs={12}>
                                <Card sx={{ p: 3, mb: 3 }}>
                                    <Typography variant="h6" gutterBottom>
                                        Thông Tin Chung
                                    </Typography>
                                    <Divider sx={{ mb: 2 }} />
                                    <Grid container spacing={2}>
                                        <Grid item sm={6} xs={12}>
                                            <TextField
                                                fullWidth
                                                name="name"
                                                label="Tên sản phẩm"
                                                color="info"
                                                size="medium"
                                                value={values.name}
                                                onBlur={handleBlur}
                                                onChange={handleFieldChange(handleChange, setFieldValue)}
                                                helperText={touched.name && errors.name}
                                                error={Boolean(touched.name && errors.name)}
                                            />
                                        </Grid>
                                        <Grid item sm={6} xs={12}>
                                            <TextField
                                                fullWidth
                                                name="sku"
                                                label="SKU"
                                                color="info"
                                                size="medium"
                                                value={values.sku}
                                                onBlur={handleBlur}
                                                onChange={handleFieldChange(handleChange, setFieldValue)}
                                                helperText={touched.sku && errors.sku}
                                                error={Boolean(touched.sku && errors.sku)}
                                            />
                                        </Grid>
                                        <Grid item sm={6} xs={12}>
                                            <TextField
                                                fullWidth
                                                name="qty"
                                                label="Số lượng"
                                                type="number"
                                                color="info"
                                                size="medium"
                                                value={values.qty}
                                                onBlur={handleBlur}
                                                onChange={handleFieldChange(handleChange, setFieldValue)}
                                                helperText={touched.qty && errors.qty}
                                                error={Boolean(touched.qty && errors.qty)}
                                            />
                                        </Grid>
                                        <Grid item sm={6} xs={12}>
                                            <TextField
                                                fullWidth
                                                name="price"
                                                label="Giá sản phẩm (VND)"
                                                type="text"
                                                color="info"
                                                size="medium"
                                                value={values.price}
                                                onBlur={handleBlur}
                                                onChange={handleFieldChange(handleChange, setFieldValue)}
                                                helperText={touched.price && errors.price}
                                                error={Boolean(touched.price && errors.price)}
                                            />
                                        </Grid>
                                        <Grid item sm={6} xs={12}>
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={values.is_approved}
                                                        onChange={(e) => {
                                                            setFieldValue("is_approved", e.target.checked);
                                                            setIsFormChanged(true);
                                                        }}
                                                        color="primary"
                                                    />
                                                }
                                                label="Trạng thái phê duyệt"
                                            />
                                        </Grid>
                                    </Grid>
                                </Card>
                            </Grid>

                            <Grid item xs={12}>
                                <Card sx={{ p: 3, mb: 3 }}>
                                    <Typography variant="h6" gutterBottom>
                                        Danh Mục
                                    </Typography>
                                    <Divider sx={{ mb: 2 }} />
                                    <Grid container spacing={2}>
                                        <Grid item sm={4} xs={12}>
                                            <TextField
                                                select
                                                fullWidth
                                                name="category_id"
                                                label="Danh mục"
                                                color="info"
                                                size="medium"
                                                value={values.category_id}
                                                onChange={handleFieldChange(handleChange, setFieldValue)}
                                                helperText={touched.category_id && errors.category_id}
                                                error={Boolean(touched.category_id && errors.category_id)}
                                            >
                                                {categories.map((category) => (
                                                    <MenuItem key={category.id} value={category.id}>
                                                        {category.name}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                        </Grid>
                                        <Grid item sm={4} xs={12}>
                                            <TextField
                                                select
                                                fullWidth
                                                name="sub_category_id"
                                                label="Danh mục con cấp 1"
                                                color="info"
                                                size="medium"
                                                value={values.sub_category_id}
                                                onChange={handleFieldChange(handleChange, setFieldValue)}
                                                helperText={touched.sub_category_id && errors.sub_category_id}
                                                error={Boolean(touched.sub_category_id && errors.sub_category_id)}
                                            >
                                                {subCategories.map((subCategory) => (
                                                    <MenuItem key={subCategory.id} value={subCategory.id}>
                                                        {subCategory.name}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                        </Grid>
                                        <Grid item sm={4} xs={12}>
                                            <TextField
                                                select
                                                fullWidth
                                                name="child_category_id"
                                                label="Danh mục con cấp 2"
                                                color="info"
                                                size="medium"
                                                value={values.child_category_id}
                                                onChange={handleFieldChange(handleChange, setFieldValue)}
                                                helperText={touched.child_category_id && errors.child_category_id}
                                                error={Boolean(touched.child_category_id && errors.child_category_id)}
                                            >
                                                {childCategories.map((childCategory) => (
                                                    <MenuItem key={childCategory.id} value={childCategory.id}>
                                                        {childCategory.name}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                        </Grid>
                                    </Grid>
                                </Card>
                            </Grid>

                            <Grid item xs={12}>
                                <Card sx={{ p: 3, mb: 3, boxShadow: 3, borderRadius: 2 }}>
                                    <Typography variant="h6" gutterBottom>
                                        Ưu Đãi
                                    </Typography>
                                    <Divider sx={{ mb: 2 }} />
                                    <Grid container spacing={3}>
                                        <Grid item xs={12}>
                                            <Typography gutterBottom>
                                                Ưu Đãi (%): {values.offer}%
                                            </Typography>
                                            <Slider
                                                value={values.offer}
                                                onChange={(event, newValue) => {
                                                    setFieldValue("offer", newValue);
                                                    setIsFormChanged(true);
                                                }}
                                                onBlur={handleBlur}
                                                step={1}
                                                min={0}
                                                max={100}
                                                valueLabelDisplay="auto"
                                                sx={{
                                                    "& .MuiSlider-track": {
                                                        color: "primary.main",
                                                    },
                                                    "& .MuiSlider-thumb": {
                                                        color: "primary.main",
                                                        "&:hover": {
                                                            boxShadow: "0px 0px 8px rgba(33, 150, 243, 0.6)",
                                                        },
                                                    },
                                                }}
                                            />
                                            {touched.offer && errors.offer && (
                                                <Typography color="error" variant="caption">
                                                    {errors.offer}
                                                </Typography>
                                            )}
                                        </Grid>

                                        {values.offer > 0 && (
                                            <>
                                                <Grid item sm={3} xs={12}>
                                                    <DatePicker
                                                        label="Ngày bắt đầu ưu đãi"
                                                        value={values.offer_start_date}
                                                        onChange={(newValue) => {
                                                            setFieldValue("offer_start_date", newValue);
                                                            setIsFormChanged(true);
                                                        }}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                fullWidth
                                                                onBlur={handleBlur}
                                                                helperText={touched.offer_start_date && errors.offer_start_date}
                                                                error={Boolean(touched.offer_start_date && errors.offer_start_date)}
                                                                sx={{
                                                                    "& .MuiOutlinedInput-notchedOutline": {
                                                                        borderColor: "primary.main",
                                                                        borderWidth: 2,
                                                                    },
                                                                    "&:hover .MuiOutlinedInput-notchedOutline": {
                                                                        borderColor: "primary.dark",
                                                                    },
                                                                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                                                        borderColor: "primary.main",
                                                                    },
                                                                }}
                                                            />
                                                        )}
                                                    />
                                                </Grid>
                                                <Grid item sm={3} xs={12}>
                                                    <DatePicker
                                                        label="Ngày kết thúc ưu đãi"
                                                        value={values.offer_end_date}
                                                        onChange={(newValue) => {
                                                            setFieldValue("offer_end_date", newValue);
                                                            setIsFormChanged(true);
                                                        }}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                fullWidth
                                                                onBlur={handleBlur}
                                                                helperText={touched.offer_end_date && errors.offer_end_date}
                                                                error={Boolean(touched.offer_end_date && errors.offer_end_date)}
                                                                sx={{
                                                                    "& .MuiOutlinedInput-notchedOutline": {
                                                                        borderColor: "primary.main",
                                                                        borderWidth: 2,
                                                                    },
                                                                    "&:hover .MuiOutlinedInput-notchedOutline": {
                                                                        borderColor: "primary.dark",
                                                                    },
                                                                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                                                        borderColor: "primary.main",
                                                                    },
                                                                }}
                                                            />
                                                        )}
                                                    />
                                                </Grid>
                                            </>
                                        )}
                                    </Grid>
                                </Card>
                            </Grid>



                            {/* Mô Tả */}
                            <Grid item xs={12}>
                                <Card sx={{ p: 3, mb: 3 }}>
                                    <Typography variant="h6" gutterBottom>
                                        Mô Tả
                                    </Typography>
                                    <Divider sx={{ mb: 2 }} />
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                name="short_description"
                                                label="Mô tả sơ lược"
                                                color="info"
                                                size="medium"
                                                multiline
                                                minRows={3}
                                                value={values.short_description}
                                                onBlur={handleBlur}
                                                onChange={handleFieldChange(handleChange, setFieldValue)}
                                                helperText={touched.short_description && errors.short_description}
                                                error={Boolean(touched.short_description && errors.short_description)}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography variant="subtitle1" gutterBottom>
                                                Mô tả đầy đủ
                                            </Typography>
                                            <SunEditor
                                                setOptions={editorConfig}
                                                setContents={values.long_description}
                                                onChange={(content) => {
                                                    setFieldValue("long_description", content);
                                                    setIsFormChanged(true);
                                                }}
                                                onBlur={() => { }}
                                            />
                                            {touched.long_description && errors.long_description && (
                                                <Typography color="error" variant="body2">
                                                    {errors.long_description}
                                                </Typography>
                                            )}
                                        </Grid>
                                    </Grid>
                                </Card>
                            </Grid>

                            {/* Các Nút Hành Động */}
                            <Grid item xs={12} mt={3} textAlign="center">
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    onClick={() => router.push("/admin/products")}
                                    sx={{ px: 4, py: 1, mr: 2, textTransform: "none" }}
                                >
                                    Trở về
                                </Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    type="submit"
                                    disabled={!isFormChanged}
                                    sx={{ px: 4, py: 1, textTransform: "none" }}
                                >
                                    {product ? "Lưu thông tin" : "Tạo sản phẩm"}
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                )}
            </Formik>
        </Card>
    );
}
