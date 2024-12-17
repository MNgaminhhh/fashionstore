"use client";

import React, { Fragment, useState } from "react";
import Grid from "@mui/material/Grid";
import Pagination from "@mui/material/Pagination";
import { FlexBetween } from "../../../components/flexbox";
import { Span } from "../../../components/Typography";
import CardProduct2 from "../../../components/card/productcard1/CardProduct2";
import { get } from "lodash";
import Products from "../../../services/Products";
import { MenuItem, Select } from "@mui/material";

type Props = { initialProducts: any; storeName?: string };

export default function ProductsGridView({
  initialProducts,
  storeName,
}: Props) {
  const [products, setProducts] = useState(initialProducts.products || []);
  const [totalPages, setTotalPages] = useState(
    initialProducts.total_pages || 1
  );
  const [currentPage, setCurrentPage] = useState(10);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const pageSizes = [5, 10, 20, 50];

  const fetchProducts = async (page: number, limit: number) => {
    try {
      const filters = { store_name: storeName };
      const response = await Products.getAllProduct(limit, page, filters);
      const newProducts = get(response, "data.data.products", []);
      const totalPages = get(response, "data.data.total_pages", 1);

      setProducts(newProducts);
      setTotalPages(totalPages);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    }
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentPage(value);
    fetchProducts(value, itemsPerPage);
  };

  const handlePageSizeChange = (event: any) => {
    const newPageSize = Number(event.target.value);
    setItemsPerPage(newPageSize);
    setCurrentPage(1);
    fetchProducts(1, newPageSize);
  };

  return (
    <Fragment>
      <Grid container spacing={3}>
        {products.length === 0 ? (
          <Span color="grey.600">Không tìm thấy sản phẩm</Span>
        ) : (
          products.map((item: any) => (
            <Grid item lg={3} sm={6} xs={12} key={item.id}>
              <CardProduct2 product={item} />
            </Grid>
          ))
        )}
      </Grid>

      <FlexBetween flexWrap="wrap" mt={6}>
        <Select
          value={itemsPerPage}
          onChange={handlePageSizeChange}
          size="small"
          sx={{ minWidth: 120 }}
        >
          {pageSizes.map((size) => (
            <MenuItem key={size} value={size}>
              {size} mục/trang
            </MenuItem>
          ))}
        </Select>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          variant="outlined"
          color="primary"
        />
      </FlexBetween>
    </Fragment>
  );
}
