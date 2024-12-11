import { Fragment } from "react";
import SliderSection from "../component/slider/SliderSection";
import { Box } from "@mui/material";
import Brand from "../../../services/Brand";
import { get } from "lodash";
import BrandsFetured from "../component/brands/BrandsFetured";
import CategoryProductView from "../component/product/CategoryProductView";
import Products from "../../../services/Products";
import Categories from "../../../services/Categories";
import ServiceListView from "../component/service/ServiceListView";
import SelectedProductsView from "../component/product/SelectedProductsView";
import SectionFlashSale from "../component/flashsale";
import FlashSale from "../../../services/FlashSale";

export default async function LandingView() {
  const brands = await Brand.getAllBrands();
  const infoBrands = get(brands, "data.data.brands", {});

  const listCate = await Categories.getFullCate();
  const categories = get(listCate, "data", []);

  const filters = { show: true };
  const listFs = await FlashSale.getFlashDeals(10, 1, filters);
  const infoFs = get(listFs, "data.products", []);

  const categoryData = await Promise.all(
    categories.map(async (category) => {
      const filter = { cate_name: category.title };
      const productsResponse = await Products.getAllProduct(10, 1, filter);
      const products = get(productsResponse, "data.data.products", []) || [];
      return {
        category,
        products,
      };
    })
  );
  const filteredCategoryData = categoryData
    .filter((data) => Array.isArray(data.products) && data.products.length > 0)
    .slice(0, 3);
  return (
    <Fragment>
      <SliderSection />
      <ServiceListView />
      <SectionFlashSale products={infoFs} />
      <SelectedProductsView />

      <BrandsFetured brands={infoBrands} />
      {filteredCategoryData.length > 0 ? (
        filteredCategoryData.map((data) => (
          <Fragment key={data.category.id}>
            <CategoryProductView data={data} />
          </Fragment>
        ))
      ) : (
        <Box textAlign="center" py={5}>
          Không có dữ liệu Danh Mục có sản phẩm
        </Box>
      )}
    </Fragment>
  );
}
