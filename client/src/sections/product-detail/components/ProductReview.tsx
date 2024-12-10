"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Rating from "@mui/material/Rating";
import TextField from "@mui/material/TextField";
import * as yup from "yup";
import { useFormik } from "formik";
import ProductComment from "./ProductComment";
import { H2, H5 } from "../../../components/Typography";
import { useAppContext } from "../../../context/AppContext";
import ReviewModel from "../../../models/Review.model";
type Props = { reviews: ReviewModel };
export default function ProductReview({ reviews }: Props) {
  const initialValues = {
    rating: 0,
    comment: "",
    date: new Date().toISOString(),
  };
  const { sessionToken } = useAppContext();
  const validationSchema = yup.object().shape({
    rating: yup.number().required("required"),
    comment: yup.string().required("required"),
  });

  const {
    dirty,
    values,
    errors,
    touched,
    isValid,
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldValue,
  } = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      resetForm();
      console.log(values);
    },
  });

  return (
    <div>
      {commentList.map((item, ind) => (
        <ProductComment {...item} key={ind} />
      ))}
      {sessionToken ? (
        <>
          <H2 fontWeight="600" mt={7} mb={2.5}>
            Viết đánh giá cho sản phẩm này
          </H2>

          <form onSubmit={handleSubmit}>
            <Box mb={2.5}>
              <Box display="flex" mb={1.5} gap={0.5}>
                <H5 color="grey.700">Đánh giá của bạn</H5>
                <H5 color="error.main">*</H5>
              </Box>

              <Rating
                color="warn"
                size="medium"
                value={values.rating}
                onChange={(_, value: any) => setFieldValue("rating", value)}
              />
            </Box>

            <Box mb={3}>
              <TextField
                rows={8}
                multiline
                fullWidth
                name="comment"
                variant="outlined"
                onBlur={handleBlur}
                value={values.comment}
                onChange={handleChange}
                placeholder="Write a review here..."
                error={!!touched.comment && !!errors.comment}
                helperText={(touched.comment && errors.comment) as string}
              />
            </Box>

            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={!(dirty && isValid)}
            >
              Gửi
            </Button>
          </form>
        </>
      ) : (
        <></>
      )}
    </div>
  );
}

const commentList = [
  {
    name: "Jannie Schumm",
    imgUrl: "/assets/images/faces/7.png",
    rating: 4.7,
    date: "2021-02-14",
    comment:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Varius massa id ut mattis. Facilisis vitae gravida egestas ac account.",
  },
  {
    name: "Joe Kenan",
    imgUrl: "/assets/images/faces/6.png",
    rating: 4.7,
    date: "2019-08-10",
    comment:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Varius massa id ut mattis. Facilisis vitae gravida egestas ac account.",
  },
  {
    name: "Jenifer Tulio",
    imgUrl: "/assets/images/faces/8.png",
    rating: 4.7,
    date: "2021-02-05",
    comment:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Varius massa id ut mattis. Facilisis vitae gravida egestas ac account.",
  },
];
