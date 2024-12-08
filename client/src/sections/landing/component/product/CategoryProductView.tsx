"use client";

import { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import Container from "@mui/material/Container";
import { StyledCard, StyledListItem } from "./styles";
import { H3, H5 } from "../../../../components/Typography";
import NavLink3 from "../../../../components/navlink/NavLink3";
import SliderShow from "../../../../components/slider/SliderShow";
import CardProduct2 from "../../../../components/card/productcard1/CardProduct2";
import { get } from "lodash";
import { Box, CircularProgress } from "@mui/material";
import Products from "../../../../services/Products";

type Props = { data: any };

export default function CategoryProductView({ data }: Props) {
  const [products, setProducts] = useState(data.products || []);
  const [selectedSubCate, setSelectedSubCate] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const responsive = [
    { breakpoint: 1200, settings: { slidesToShow: 3 } },
    { breakpoint: 650, settings: { slidesToShow: 2 } },
    { breakpoint: 426, settings: { slidesToShow: 1 } },
  ];

  const handleSubCategoryClick = async (subCateName: string) => {
    setSelectedSubCate(subCateName);
    setLoading(true);
    setError(null);
    try {
      const filter = {
        cate_name: data.category.title,
        sub_cate_name: subCateName,
      };
      const productsResponse = await Products.getAllProduct(10, 1, filter);
      const fetchedProducts =
        get(productsResponse, "data.data.products", []) || [];
      setProducts(fetchedProducts);
    } catch (err) {
      setError("Đã xảy ra lỗi khi tải sản phẩm.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const shouldInfinite = products.length > 4;
  return (
    <Container sx={{ mb: 2 }}>
      <Grid container spacing={3}>
        <Grid item md={3} xs={12}>
          <StyledCard elevation={0}>
            <H3>{data.category.title}</H3>

            {data.category.children && data.category.children.length > 0 && (
              <List sx={{ mb: 2 }}>
                {data.category.children.map((item: any, index: number) => (
                  <StyledListItem
                    key={index}
                    onClick={() => handleSubCategoryClick(item.title)}
                    selected={selectedSubCate === item.title}
                    sx={{
                      cursor: "pointer",
                      backgroundColor:
                        selectedSubCate === item.title
                          ? "grey.300"
                          : "transparent",
                      "&:hover": { backgroundColor: "grey.200" },
                    }}
                  >
                    {item.title}
                  </StyledListItem>
                ))}
              </List>
            )}

            <NavLink3
              href="/"
              text="Xem chi tiết"
              color="dark.main"
              hoverColor="dark.main"
            />
          </StyledCard>
        </Grid>
        <Grid item md={9} xs={12}>
          {loading ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              py={5}
            >
              <CircularProgress color="primary" />
              Đang tải sản phẩm...
            </Box>
          ) : error ? (
            <Box textAlign="center" py={5} color="error.main">
              {error}
            </Box>
          ) : products.length > 0 ? (
            <SliderShow
              slidesToShow={4}
              responsive={responsive}
              arrowStyles={{ backgroundColor: "dark.main" }}
              infinite={shouldInfinite}
            >
              {products.map((product: any) => (
                <CardProduct2 product={product} key={product.id} />
              ))}
            </SliderShow>
          ) : (
            <Box textAlign="center" py={5}>
              Không có sản phẩm cho danh mục con này.
            </Box>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}
