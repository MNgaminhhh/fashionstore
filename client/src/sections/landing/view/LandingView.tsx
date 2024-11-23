import { Fragment } from "react";
import SliderSection from "../component/slider/SliderSection";
import { Box } from "@mui/material";
import Brand from "../../../services/Brand";
import { get } from "lodash";
import BrandsFetured from "../component/brands/BrandsFetured";

export default async function LandingView() {
  const brands = await Brand.getAllBrands();
  const infoBrands = get(brands, "data.data.brands", {});
  return (
    <Fragment>
      <SliderSection />
      <BrandsFetured brands={infoBrands} />
      <Box sx={{ height: "100vh" }} />
    </Fragment>
  );
}
