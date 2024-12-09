"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import styled from "@mui/material/styles/styled";
import ProductDescription from "./ProductDescription";
import ProductModel from "../../../models/Product.model";
import VendorModel from "../../../models/Vendor.model";
import ProductVendorInfo from "./ProductVendorInfo";
import ReviewModel from "../../../models/Review.model";
import ProductReview from "./ProductReview";

const StyledTabs = styled(Tabs)(({ theme }) => ({
  minHeight: 0,
  marginBottom: 24,
  borderBottom: `1px solid ${theme.palette.text.disabled}`,
  "& .inner-tab": {
    minHeight: 40,
    fontWeight: 600,
    textTransform: "capitalize",
  },
}));
type Props = {
  product: ProductModel;
  vendor: VendorModel;
  reviews: ReviewModel;
};
export default function ProductTabs({ product, vendor, reviews }: Props) {
  const [selectedOption, setSelectedOption] = useState(0);
  const handleOptionClick = (_, value: number) => setSelectedOption(value);
  return (
    <>
      <StyledTabs
        textColor="primary"
        value={selectedOption}
        indicatorColor="primary"
        onChange={handleOptionClick}
      >
        <Tab className="inner-tab" label="Chi tiết sản phẩm" />
        <Tab className="inner-tab" label="Thông tin cửa hàng" />
        <Tab className="inner-tab" label="Đánh giá" />
      </StyledTabs>

      <Box mb={6}>
        {selectedOption === 0 && (
          <ProductDescription long_description={product.long_description} />
        )}
        {selectedOption === 1 && <ProductVendorInfo vendor={vendor} />}
        {selectedOption === 2 && <ProductReview reviews />}
      </Box>
    </>
  );
}
