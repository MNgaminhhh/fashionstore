import { Fragment } from "react";
import SliderSection from "../component/slider/SliderSection";
import { Box } from "@mui/material";
import Brand from "../../../services/Brand";
import { get } from "lodash";
import BrandsFetured from "../component/brands/BrandsFetured";
import CategoryProductView from "../component/product/CategoryProductView";
import Products from "../../../services/Products";
import Categories from "../../../services/Categories";

export default async function LandingView() {
  const brands = await Brand.getAllBrands();
  const infoBrands = get(brands, "data.data.brands", {});

  const listCate = await Categories.getFullCate();
  const categories = get(listCate, "data", []);

  // const filter = { cate_name };
  // const products = await Products.getAllProduct(10, 1);
  // const infoProduct = get(products, "data.data.brands", {});

  const categoryData = await Promise.all(
    categories.map(async (category) => {
      const filter = { cate_name: category.title };
      const productsResponse = await Products.getAllProduct(10, 1, filter);
      const products = get(productsResponse, "data.data.products", []);
      return {
        category,
        products,
      };
    })
  );

  return (
    <Fragment>
      <SliderSection />
      <BrandsFetured brands={infoBrands} />
      {categoryData.map((data, index) => (
        <>
          <CategoryProductView key={index} data={data} />
          <Box sx={{ height: "50vh" }} />
        </>
      ))}
    </Fragment>
  );
}
