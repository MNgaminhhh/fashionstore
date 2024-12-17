"use client";

import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import ProductModel from "../../../../models/Product.model";
import { FlexBetween, FlexBox } from "../../../../components/flexbox";
import CardProduct2 from "../../../../components/card/productcard1/CardProduct2";
import { H3, Paragraph } from "../../../../components/Typography";
import SliderShow from "../../../../components/slider/SliderShow";
import { get } from "lodash";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Products from "../../../../services/Products";

export default function SelectedProductsView() {
  const [selected, setSelected] = useState<string>("");
  const [products, setProducts] = useState<ProductModel[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const responsive = [
    { breakpoint: 1200, settings: { slidesToShow: 4 } },
    { breakpoint: 1024, settings: { slidesToShow: 3 } },
    { breakpoint: 650, settings: { slidesToShow: 2 } },
    { breakpoint: 426, settings: { slidesToShow: 1 } },
  ];

  const handleSelected = (item: string) => () => setSelected(item);

  const activeColor = (item: string) => (item === selected ? "error" : "dark");

  const FILTER_BUTTONS = [
    { id: 1, title: "Tất Cả", value: "" },
    { id: 2, title: "Hàng Mới Về", value: "new_arrival" },
    { id: 2, title: "Sản Phẩm Tốt Nhất", value: "best_product" },
    { id: 3, title: "Sản Phẩm Nổi Bật", value: "featured_product" },
    { id: 4, title: "Sản Phẩm Hàng Đầu", value: "top_product" },
  ];
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        let filter: any = { is_approved: true };

        if (selected !== "view") {
          filter.product_type = selected;
        }

        const productsResponse = await Products.getAllProduct(10, 1, filter);
        const fetchedProducts: ProductModel[] =
          get(productsResponse, "data.data.products", []) || [];

        setProducts(fetchedProducts);
      } catch (err) {
        setError("Đã xảy ra lỗi khi tải sản phẩm.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selected]);

  return (
    <Container>
      <FlexBetween gap={2} flexWrap="wrap" mb={3}>
        <div>
          <H3>Sản Phẩm Được Chọn</H3>
          <Paragraph>
            Tất cả những sản phẩm mới của chúng tôi đều được lựa chọn từ thương
            hiệu độc quyền.
          </Paragraph>
        </div>

        <FlexBox flexWrap="wrap" gap={1} sx={{ "& button": { flexGrow: 1 } }}>
          {FILTER_BUTTONS.map(({ id, title, value }) => (
            <Button
              key={id}
              variant="outlined"
              color={activeColor(value)}
              onClick={handleSelected(value)}
            >
              {title}
            </Button>
          ))}
        </FlexBox>
      </FlexBetween>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" py={5}>
          <CircularProgress color="primary" />
        </Box>
      ) : error ? (
        <Box textAlign="center" py={5} color="error.main">
          {error}
        </Box>
      ) : products.length > 0 ? (
        <SliderShow
          slidesToShow={5}
          responsive={responsive}
          arrowStyles={{ backgroundColor: "dark.main" }}
          infinite={products.length > 5}
        >
          {products.map((product) => (
            <CardProduct2 product={product} key={product.id} />
          ))}
        </SliderShow>
      ) : (
        <Box textAlign="center" py={5}>
          Không có sản phẩm cho bộ lọc này
        </Box>
      )}
    </Container>
  );
}
