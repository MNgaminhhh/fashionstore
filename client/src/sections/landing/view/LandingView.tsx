import { Fragment } from "react";
import SliderSection from "../component/slider/SliderSection";
import { Box } from "@mui/material";

export default function LandingView() {
  return (
    <Fragment>
      <SliderSection />
      <Box sx={{ height: "100vh" }} />
    </Fragment>
  );
}
