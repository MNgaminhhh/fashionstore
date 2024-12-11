"use client";

import { useCallback, useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import { H3, Paragraph, Span } from "../../../components/Typography";
import {
  ProductFilterKeys,
  ProductFilterValues,
  ProductFilters,
} from "../type";
import ProductFilterCard from "../components/ProductFilterCard";
import CardProduct2 from "../../../components/card/productcard1/CardProduct2";
import ProductModel from "../../../models/Product.model";
import { Pagination, Select, MenuItem } from "@mui/material";
import { get } from "lodash";
import Products from "../../../services/Products";
import { useAppContext } from "../../../context/AppContext";
import { boolean } from "yup";

const initialFilters: ProductFilters = {
  productType: [],
  price: [0, 10000000],
  category: {
    cate_names: [],
    sub_cate_names: [],
    child_cate_names: [],
  },
};

type Props = { initialProducts: any; showfilter?: boolean; title?: string };

export default function ProductSearchPageView({
  initialProducts,
  showfilter = true,
  title,
}: Props) {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [filters, setFilters] = useState<ProductFilters>({ ...initialFilters });
  const [products, setProducts] = useState<any>(initialProducts.products);
  const [totalPages, setTotalPages] = useState<number>(
    initialProducts.total_pages || 1
  );
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const pageSizes = [5, 10, 20, 50];
  const { role } = useAppContext();
  const handleChangeFilters = (
    key: ProductFilterKeys,
    values: ProductFilterValues
  ) => {
    setFilters((prev) => ({ ...prev, [key]: values }));
    setPage(1);
  };

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await Products.getAllProduct(
        itemsPerPage,
        page,
        filters
      );
      const newProducts = get(response, "data.data.products", []);
      const totalPages = get(response, "data.data.total_pages", 1);

      setProducts(newProducts);
      setTotalPages(totalPages);
    } catch (err) {
      setError("Có lỗi xảy ra khi tải sản phẩm.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, itemsPerPage, filters]);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  const handlePageSizeChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setItemsPerPage(Number(event.target.value));
    setPage(1);
  };

  return (
    <div className="bg-white pt-2 pb-4">
      <Container>
        {title ? <H3 marginBottom={3}>{title}</H3> : <></>}
        <Grid container spacing={4}>
          {showfilter ? (
            <Grid
              item
              xl={2}
              md={3}
              sx={{ display: { md: "block", xs: "none" } }}
            >
              <ProductFilterCard
                filters={filters}
                changeFilters={handleChangeFilters}
              />
            </Grid>
          ) : (
            <></>
          )}

          <Grid item xl={10} md={9} xs={12}>
            {error && <Paragraph color="error">{error}</Paragraph>}

            {loading ? (
              <Paragraph>Đang tải...</Paragraph>
            ) : (
              <Grid container spacing={3}>
                {products.length === 0 ? (
                  <Span color="grey.600">Không tìm thấy sản phẩm</Span>
                ) : (
                  products.map((item: ProductModel) => (
                    <Grid item lg={3} sm={6} xs={12} key={item.id}>
                      <CardProduct2 product={item} />
                    </Grid>
                  ))
                )}
              </Grid>
            )}

            {showfilter ? (
              <>
                <Grid
                  container
                  justifyContent="space-between"
                  alignItems="center"
                  mt={4}
                >
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
                    page={page}
                    onChange={handlePageChange}
                    variant="outlined"
                    color="primary"
                  />
                </Grid>
              </>
            ) : (
              <></>
            )}
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}
