"use client";

import { useState } from "react";
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
  Divider,
  Box,
  IconButton,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import Products from "../../../../services/Products";
import Categories from "../../../../services/Categories";
import SubCategory from "../../../../services/SubCategory";
import CategoriesModel from "../../../../models/Categories.model";
import ProductModel from "../../../../models/Product.model";
import MTDropZone2 from "../../../../components/MTDropZone2";
import {
  notifyError,
  notifySuccess,
} from "../../../../utils/ToastNotification";
import { slugify } from "../../../../utils/slugify"; // Import hàm slugify
import CloseIcon from "@mui/icons-material/Close";
import File from "../../../../services/File";

const VALIDATION_SCHEMA = yup.object().shape({
  name: yup
    .string()
    .required("Tên sản phẩm là bắt buộc")
    .max(100, "Tên sản phẩm không được vượt quá 100 ký tự"),
  status: yup.string(),
  product_type: yup.string().required("Loại sản phẩm là bắt buộc"),
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

type Props = {
  cat: CategoriesModel;
  token: string;
  product?: ProductModel;
};

export default function ProductForm({ product, token, cat }: Props) {
  const router = useRouter();
  const [isFormChanged, setIsFormChanged] = useState(false);
  const [categories, setCategories] = useState(cat || []);
  const [subCategories, setSubCategories] = useState<
    Array<{ id: string; name: string }>
  >([]);
  const [childCategories, setChildCategories] = useState<
    Array<{ id: string; name: string }>
  >([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  const fetchSubCategories = async (categoryId: string) => {
    try {
      const res = await SubCategory.getSubCategories(categoryId);
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
    name: product?.name || "",
    slug: product ? product.slug : "",
    images: product?.images || [],
    category_id: product?.category_id || "",
    sub_category_id: product?.sub_category_id || "",
    child_category_id: product?.child_category_id || "",
    short_description: product?.short_description || "",
    long_description: product?.long_description || "",
    product_type: product?.product_type || "none",
    offer: product?.offer || 0,
    offer_start_date: product?.offer_start_date || null,
    offer_end_date: product?.offer_end_date || null,
    status: product?.status || "inactive",
  };

  // Hàm xử lý khi gửi form
  const handleFormSubmit = async (values: ProductModel) => {
    try {
      // Nếu slug chưa được tạo, tạo slug từ name
      if (!values.slug) {
        values.slug = slugify(values.name);
      }

      setUploading(true);

      // Chuyển đổi các trường sub_category_id và child_category_id thành null nếu chúng là chuỗi rỗng
      const processedValues = {
        ...values,
        sub_category_id:
          values.sub_category_id === "" ? null : values.sub_category_id,
        child_category_id:
          values.child_category_id === "" ? null : values.child_category_id,
      };

      console.log("Processed Values:", processedValues);

      let uploadedImageUrls: string[] = [...processedValues.images]; // Các URL hình ảnh hiện có

      if (selectedFiles.length > 0) {
        // Tạo FormData cho các tệp
        const formData = new FormData();
        selectedFiles.forEach((file) => {
          formData.append("file", file); // Giả sử API chấp nhận nhiều tệp dưới khóa 'files'
        });

        console.log("FormData Entries:");
        formData.forEach((value, key) => {
          console.log(key, value);
        });

        // Tải lên các tệp
        const uploadResponse = await File.upload(formData, token);
        console.log("Upload Response:", uploadResponse);

        if (uploadResponse.data.success) {
          const newImageUrls: string[] = uploadResponse.data.data.files; // Lấy URL từ response
          uploadedImageUrls = [...uploadedImageUrls, ...newImageUrls];
        } else {
          throw new Error(
            uploadResponse.data.message || "Tải lên hình ảnh thất bại."
          );
        }
      }

      // Gán URL hình ảnh đã tải lên vào dữ liệu sản phẩm
      const productData: ProductModel = {
        ...processedValues,
        images: uploadedImageUrls,
      };

      console.log("Product Data:", productData);

      // Gửi dữ liệu sản phẩm lên API
      const rs = await Products.create(productData, token);
      if (rs.data.success) {
        notifySuccess("Tạo sản phẩm mới thành công!");
        router.push("/admin/products");
      } else {
        notifyError("Tạo sản phẩm thất bại: " + rs.data.message);
      }
      setIsFormChanged(false);
    } catch (error: any) {
      console.error("Error:", error);
      notifyError(error.message || "Có lỗi xảy ra. Vui lòng thử lại sau!");
    } finally {
      setUploading(false);
    }
  };

  // Hàm xử lý khi thay đổi trường input
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

  // Cấu hình cho SunEditor
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
        enableReinitialize={true} // Cho phép reinitialize khi product thay đổi
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
                    {/* Tên Sản Phẩm */}
                    <Grid item sm={12} xs={12}>
                      <TextField
                        fullWidth
                        name="name"
                        label="Tên sản phẩm"
                        color="info"
                        size="medium"
                        value={values.name}
                        onBlur={handleBlur}
                        onChange={handleFieldChange(
                          handleChange,
                          setFieldValue
                        )}
                        helperText={touched.name && errors.name}
                        error={Boolean(touched.name && errors.name)}
                      />
                    </Grid>

                    {/* Chọn Hình Ảnh Mới */}
                    <Grid item sm={12} xs={12}>
                      <MTDropZone2
                        title="Kéo & thả hình ảnh sản phẩm vào đây"
                        imageSize="Tải lên ảnh kích thước 1024*1024"
                        files={selectedFiles}
                        onChange={(updatedFiles) => {
                          setSelectedFiles(updatedFiles);
                          setIsFormChanged(true);
                        }}
                      />
                    </Grid>

                    {/* Trạng Thái Hiển Thị */}
                    <Grid item sm={6} xs={12}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={values.status === "active"}
                            onChange={(e) => {
                              setFieldValue(
                                "status",
                                e.target.checked ? "active" : "inactive"
                              );
                              setIsFormChanged(true);
                            }}
                            color="primary"
                          />
                        }
                        label="Hiển thị"
                      />
                    </Grid>
                  </Grid>
                </Card>
              </Grid>

              {/* Danh Mục */}
              <Grid item xs={12}>
                <Card sx={{ p: 3, mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Danh Mục
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Grid container spacing={2}>
                    {/* Danh Mục Chính */}
                    <Grid item sm={4} xs={12}>
                      <TextField
                        select
                        fullWidth
                        name="category_id"
                        label="Danh mục"
                        color="info"
                        size="medium"
                        value={values.category_id}
                        onChange={handleFieldChange(
                          handleChange,
                          setFieldValue
                        )}
                        helperText={touched.category_id && errors.category_id}
                        error={Boolean(
                          touched.category_id && errors.category_id
                        )}
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
                        onChange={handleFieldChange(
                          handleChange,
                          setFieldValue
                        )}
                        helperText={
                          touched.sub_category_id && errors.sub_category_id
                        }
                        error={Boolean(
                          touched.sub_category_id && errors.sub_category_id
                        )}
                      >
                        <MenuItem value="">
                          <em>Không có</em>
                        </MenuItem>
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
                        onChange={handleFieldChange(
                          handleChange,
                          setFieldValue
                        )}
                        helperText={
                          touched.child_category_id && errors.child_category_id
                        }
                        error={Boolean(
                          touched.child_category_id && errors.child_category_id
                        )}
                      >
                        <MenuItem value="">
                          <em>Không có</em>
                        </MenuItem>
                        {childCategories.map((childCategory) => (
                          <MenuItem
                            key={childCategory.id}
                            value={childCategory.id}
                          >
                            {childCategory.name}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                  </Grid>
                </Card>
              </Grid>

              {/* Ưu Đãi */}
              <Grid item xs={12}>
                <Card sx={{ p: 3, mb: 3, boxShadow: 3, borderRadius: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Ưu Đãi
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Grid container spacing={3}>
                    {/* Slider Ưu Đãi */}
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

                    {/* Ngày Bắt Đầu và Kết Thúc Ưu Đãi */}
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
                                helperText={
                                  touched.offer_start_date &&
                                  errors.offer_start_date
                                }
                                error={Boolean(
                                  touched.offer_start_date &&
                                    errors.offer_start_date
                                )}
                                sx={{
                                  "& .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "primary.main",
                                    borderWidth: 2,
                                  },
                                  "&:hover .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "primary.dark",
                                  },
                                  "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                    {
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
                                helperText={
                                  touched.offer_end_date &&
                                  errors.offer_end_date
                                }
                                error={Boolean(
                                  touched.offer_end_date &&
                                    errors.offer_end_date
                                )}
                                sx={{
                                  "& .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "primary.main",
                                    borderWidth: 2,
                                  },
                                  "&:hover .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "primary.dark",
                                  },
                                  "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                    {
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
                    {/* Mô tả Sơ Lược */}
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
                        onChange={handleFieldChange(
                          handleChange,
                          setFieldValue
                        )}
                        helperText={
                          touched.short_description && errors.short_description
                        }
                        error={Boolean(
                          touched.short_description && errors.short_description
                        )}
                      />
                    </Grid>

                    {/* Mô tả Đầy đủ */}
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
                        onBlur={() => {}}
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

              {/* Hiển Thị Hình Ảnh Hiện Có */}
              {values.images.length > 0 && (
                <Grid item xs={12}>
                  <Card sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Hình ảnh hiện có
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Box display="flex" flexWrap="wrap" gap={2}>
                      {values.images.map((image, index) => (
                        <Box
                          key={index}
                          width={100}
                          height={100}
                          position="relative"
                        >
                          <img
                            src={image}
                            alt={`Existing Image ${index}`}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              borderRadius: "8px",
                            }}
                          />
                          <IconButton
                            size="small"
                            onClick={() => {
                              const updatedImages = values.images.filter(
                                (_, i) => i !== index
                              );
                              setFieldValue("images", updatedImages);
                              setIsFormChanged(true);
                            }}
                            sx={{
                              position: "absolute",
                              top: 0,
                              right: 0,
                              backgroundColor: "rgba(255, 255, 255, 0.7)",
                            }}
                          >
                            <CloseIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      ))}
                    </Box>
                  </Card>
                </Grid>
              )}

              {/* Nút Tạo Sản Phẩm */}
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
                  disabled={!isFormChanged || uploading}
                  sx={{ px: 4, py: 1, textTransform: "none" }}
                >
                  {uploading
                    ? "Đang tải lên..."
                    : product
                    ? "Lưu thông tin"
                    : "Tạo sản phẩm"}
                </Button>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </Card>
  );
}
