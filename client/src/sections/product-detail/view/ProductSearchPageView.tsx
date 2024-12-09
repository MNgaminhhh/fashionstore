"use client";

import { useCallback, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { Theme } from "@mui/material/styles";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import useMediaQuery from "@mui/material/useMediaQuery";
import Apps from "@mui/icons-material/Apps";
import ViewList from "@mui/icons-material/ViewList";
import FilterList from "@mui/icons-material/FilterList";

import { H5, Paragraph, Span } from "../../../components/Typography";
import {
  ProductFilterKeys,
  ProductFilterValues,
  ProductFilters,
} from "../type";
import ProductFilterCard from "../components/ProductFilterCard";
import { FlexBetween, FlexBox } from "../../../components/flexbox";
import ProductsGridView from "../components/ProductsGridView";
import ProductsService from "../../../services/Products";
import CardProduct2 from "../../../components/card/productcard1/CardProduct2";
import ProductModel from "../../../models/Product.model";

const initialFilters: ProductFilters = {
  rating: 0,
  color: [],
  brand: [],
  sales: [],
  price: [0, 300],
};

type Props = { initialProducts: any };

export default function ProductSearchPageView({ initialProducts }: Props) {
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

          <Grid item xl={10} md={9} xs={12}>
            {error && <Paragraph color="error">{error}</Paragraph>}

            {!loading && !error && (
              <>
                <Grid container spacing={3}>
                  {initialProducts.products.length === 0 ? (
                    <Span color="grey.600">Không tìm thấy sản phẩm</Span>
                  ) : (
                    initialProducts.products.map((item: ProductModel) => (
                      <Grid item lg={4} sm={6} xs={12} key={item.id}>
                        <CardProduct2 product={item} />
                      </Grid>
                    ))
                  )}
                </Grid>
              </>
            )}
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}
