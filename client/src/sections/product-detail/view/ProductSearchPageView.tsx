"use client";

import { useCallback, useState } from "react";
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
const initialFilters: ProductFilters = {
  productType: [],
  price: [0, 10000000],
  category: {
    cate_names: [],
    sub_cate_names: [],
    child_cate_names: [],
  },
};

type Props = {
  initialProducts: any;
  title: string;
  showfilter?: boolean;
};

export default function ProductSearchPageView({
  initialProducts,
  title,
  showfilter = false,
}: Props) {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [filters, setFilters] = useState<ProductFilters>({ ...initialFilters });
  const [products, setProducts] = useState<any>(initialProducts.products);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);

  const handleChangeFilters = (
    key: ProductFilterKeys,
    values: ProductFilterValues
  ) => {
    setFilters((prev) => ({ ...prev, [key]: values }));
    setPage(1);
  };

  const toggleView = useCallback((v: "grid" | "list") => () => setView(v), []);

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  return (
    <div className="bg-white pt-2 pb-4">
      <Container>
        <Grid container spacing={4}>
          {showfilter && (
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
          )}

          <Grid item xl={10} md={9} xs={12}>
            <H3 mb={2}>{title}</H3>
            {error && <Paragraph color="error">{error}</Paragraph>}

            {!loading && !error && (
              <Grid container spacing={3}>
                {(initialProducts?.products ?? []).length === 0 ? (
                  <Grid item lg={3} sm={6} xs={12}>
                    <Span color="grey.600">Không tìm thấy sản phẩm</Span>
                  </Grid>
                ) : (
                  initialProducts.products.map((item: ProductModel) => (
                    <Grid item lg={3} sm={6} xs={12} key={item.id}>
                      <CardProduct2 product={item} />
                    </Grid>
                  ))
                )}
              </Grid>
            )}
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}
