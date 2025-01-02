"use client";

import { useState, useEffect, useCallback } from "react";
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
  Divider,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
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
import { slugify } from "../../../../utils/slugify";
import File from "../../../../services/File";
import ChildCategory from "../../../../services/ChildCategory";
import { UploadBeforeReturn } from "suneditor-react/dist/types/upload";

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
});

type Props = {
  cat: CategoriesModel;
  token: string;
  product?: ProductModel;
};

type ImageType = {
  id: string;
  src: string;
  file?: File;
};

export default function ProductForm({ product, token, cat }: Props) {
  const [images, setImages] = useState<ImageType[]>(
    product?.images.map((url, index) => ({
      id: `existing-${index}`,
      src: url,
    })) || []
  );
  const router = useRouter();
  const [isFormChanged, setIsFormChanged] = useState(false);
  const [categories, setCategories] = useState(cat || []);
  const [subCategories, setSubCategories] = useState([]);
  const [childCategories, setChildCategories] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (product?.category_id) {
      fetchSubCategories(product.category_id);
    }
  }, [product?.category_id]);

  useEffect(() => {
    if (product?.sub_category_id) {
      fetchChildCategories(product.sub_category_id);
    }
  }, [product?.sub_category_id]);

  const fetchSubCategories = useCallback(
    async (categoryId: string) => {
      try {
        const res = await SubCategory.getList(token, true, categoryId);
        if (res.data && Array.isArray(res.data.sub_categories)) {
          setSubCategories(res.data.sub_categories);
        } else {
          setSubCategories([]);
        }
      } catch (error) {
        console.error("Error fetching sub categories:", error);
        setSubCategories([]);
      }
    },
    [token]
  );

  const fetchChildCategories = useCallback(
    async (subCategoryId: string) => {
      try {
        const res = await ChildCategory.getList(token, true, subCategoryId);
        if (res.data && Array.isArray(res.data.child_categories)) {
          setChildCategories(res.data.child_categories);
        } else {
          setChildCategories([]);
        }
      } catch (error) {
        console.error("Error fetching child categories:", error);
        setChildCategories([]);
      }
    },
    [token]
  );

  const INITIAL_VALUES: any = {
    name: product?.name || "",
    slug: product ? product.slug : "",
    images: [],
    category_id:
      product?.category_id === "00000000-0000-0000-0000-000000000000"
        ? null
        : product?.category_id || "",
    sub_category_id:
      product?.sub_category_id === "00000000-0000-0000-0000-000000000000"
        ? null
        : product?.sub_category_id || "",
    child_category_id:
      product?.child_category_id === "00000000-0000-0000-0000-000000000000"
        ? null
        : product?.child_category_id || "",
    short_description: product?.short_description || "",
    long_description: product?.long_description || "",
    product_type: product?.product_type || "none",
    status: product?.status || "inactive",
  };

  const handleFormSubmit = async (values: ProductModel) => {
    try {
      if (!values.slug) {
        values.slug = slugify(values.name);
      }

      setUploading(true);
      const processedValues = {
        ...values,
        sub_category_id:
          values.sub_category_id === "" ? null : values.sub_category_id,
        child_category_id:
          values.child_category_id === "" ? null : values.child_category_id,
      };

      let uploadedImageUrls: string[] = [];
      for (const image of images) {
        if (image.file) {
          const formData = new FormData();
          formData.append("file", image.file);
          const uploadResponse = await File.upload(formData, token);

          if (uploadResponse.data.success) {
            const newImageUrls: string[] = uploadResponse.data.data.files;
            uploadedImageUrls.push(...newImageUrls);
          } else {
            throw new Error(
              uploadResponse.data.message || "Tải lên hình ảnh thất bại."
            );
          }
        } else {
          uploadedImageUrls.push(image.src);
        }
      }

      const productData: ProductModel = {
        ...processedValues,
        images: uploadedImageUrls,
      };

      let response;

      if (product) {
        response = await Products.update(product.id, productData, token, true);
      } else {
        response = await Products.create(productData, token, true);
      }

      if (response.data.success) {
        notifySuccess(
          product ? "Cập nhật sản phẩm thành công!" : "Tạo sản phẩm thành công!"
        );
        router.push("/dashboard/vendor/product");
        router.refresh();
      } else {
        notifyError(
          `${
            product ? "Cập nhật sản phẩm thất bại: " : "Tạo sản phẩm thất bại: "
          }${response.data.message}`
        );
      }

      setIsFormChanged(false);
    } catch (error: any) {
      console.error("Error:", error);
      notifyError(error.message || "Có lỗi xảy ra. Vui lòng thử lại sau!");
    } finally {
      setUploading(false);
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
          setFieldValue("child_category_id", "");
          setChildCategories([]);
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
    height: "800px",
    imageUpload: true,
  };
  const handleImageUploadBefore = (
    files: File[],
    info: object,
    uploadHandler: (data: { result: any }) => void
  ): any => {
    (async () => {
      try {
        const uploadedImages: { url: string; name: string; size: number }[] =
          [];

        for (const file of files) {
          if (!file.type.startsWith("image/")) {
            notifyError("Chỉ hỗ trợ tải lên các tệp hình ảnh.");
            continue;
          }

          if (file.size > 10 * 1024 * 1024) {
            notifyError("Kích thước hình ảnh không được vượt quá 10MB.");
            continue;
          }

          const formData = new FormData();
          formData.append("file", file);

          try {
            const response = await File.upload(formData, token);
            if (
              response?.data?.success &&
              response?.data?.data?.files &&
              response.data.data.files.length > 0
            ) {
              const url = response.data.data.files[0];

              const randomName = `image_${Math.random()
                .toString(36)
                .substring(2, 15)}.png`;
              const randomSize = Math.floor(Math.random() * 1000) + 100;

              uploadedImages.push({
                url: url,
                name: randomName,
                size: randomSize,
              });
            } else {
              throw new Error(
                response.data?.message || "Tải lên hình ảnh thất bại."
              );
            }
          } catch (error: any) {
            notifyError(
              error.message ||
                "Đã xảy ra lỗi khi tải lên hình ảnh. Vui lòng thử lại."
            );
          }
        }

        if (uploadedImages.length > 0) {
          uploadHandler({
            result: uploadedImages,
          });
        } else {
          uploadHandler({ result: [] });
        }
      } catch (error: any) {
        notifyError(
          error.message ||
            "Đã xảy ra lỗi khi tải lên hình ảnh. Vui lòng thử lại."
        );
        uploadHandler({ result: [] });
      }
    })();
  };

  return (
    <Card sx={{ p: 4, mx: "auto", boxShadow: 3 }}>
      <Formik
        onSubmit={handleFormSubmit}
        initialValues={INITIAL_VALUES}
        validationSchema={VALIDATION_SCHEMA}
        enableReinitialize={true}
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
              <Grid item xs={12}>
                <Card sx={{ p: 3, mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Thông Tin Chung
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Grid container spacing={2}>
                    <Grid item sm={10} xs={12}>
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
                        helperText={
                          touched.name && errors.name
                            ? typeof errors.name === "string"
                              ? errors.name
                              : ""
                            : ""
                        }
                        error={Boolean(touched.name && errors.name)}
                      />
                    </Grid>
                    <Grid item sm={2} xs={12} sx={{ my: "auto" }}>
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
                    <Grid item sm={12} xs={12}>
                      <MTDropZone2
                        title="Kéo & thả hình ảnh sản phẩm vào đây"
                        imageSize="Tải lên ảnh kích thước 1024*1024"
                        images={images}
                        onChange={(updatedImages) => {
                          setImages(updatedImages);
                          setIsFormChanged(true);
                        }}
                      />
                    </Grid>
                  </Grid>
                </Card>
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
                        onChange={handleFieldChange(
                          handleChange,
                          setFieldValue
                        )}
                        helperText={
                          touched.category_id && errors.category_id
                            ? String(errors.category_id)
                            : ""
                        }
                        error={Boolean(
                          touched.category_id && errors.category_id
                        )}
                      >
                        {Array.isArray(categories) ? (
                          categories.map((category) => (
                            <MenuItem key={category.id} value={category.id}>
                              {category.name}
                            </MenuItem>
                          ))
                        ) : (
                          <MenuItem value="">
                            <em>Không có danh mục</em>
                          </MenuItem>
                        )}
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
                            ? Array.isArray(errors.sub_category_id)
                              ? errors.sub_category_id.join(", ")
                              : String(errors.sub_category_id)
                            : ""
                        }
                        error={Boolean(
                          touched.sub_category_id && errors.sub_category_id
                        )}
                        disabled={!values.category_id}
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
                            ? Array.isArray(errors.child_category_id)
                              ? errors.child_category_id.join(", ")
                              : String(errors.child_category_id)
                            : ""
                        }
                        error={Boolean(
                          touched.child_category_id && errors.child_category_id
                        )}
                        disabled={!values.sub_category_id}
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
                        onChange={handleFieldChange(
                          handleChange,
                          setFieldValue
                        )}
                        helperText={
                          touched.short_description && errors.short_description
                            ? Array.isArray(errors.short_description)
                              ? errors.short_description.join(", ")
                              : String(errors.short_description)
                            : ""
                        }
                        error={Boolean(
                          touched.short_description && errors.short_description
                        )}
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
                        }}
                        onImageUploadBefore={handleImageUploadBefore}
                      />
                      {touched.long_description && errors.long_description && (
                        <Typography color="error" variant="body2">
                          {Array.isArray(errors.long_description)
                            ? errors.long_description.join(", ")
                            : String(errors.long_description)}
                        </Typography>
                      )}
                    </Grid>
                  </Grid>
                </Card>
              </Grid>

              <Grid item xs={12} mt={3} textAlign="center">
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => router.push("/dashboard/vendor/product")}
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
