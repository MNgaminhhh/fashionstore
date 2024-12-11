import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { Slider } from "../../../../components/slider";
import MTImage from "../../../../components/MTImage";
import { FlexCenterRow } from "../../../../components/flexbox";
import BrandsModel from "../../../../models/Brands.model";
import { H3 } from "../../../../components/Typography";
import { data } from "./data";
import Link from "next/link";

type Props = { brands?: BrandsModel[] };

export default function BrandsFeatured({ brands = [] }: Props) {
  const responsive = [
    { breakpoint: 1024, settings: { slidesToShow: 5 } },
    { breakpoint: 800, settings: { slidesToShow: 4 } },
    { breakpoint: 650, settings: { slidesToShow: 3 } },
  ];
  const loopedBrands = Array.isArray(brands)
    ? [...brands, ...brands]
    : [...data, ...data];

  return (
    <Container className="mt-2 mb-2">
      <H3 mb={2}>Thương hiệu nổi bật</H3>
      <Box
        padding={2}
        bgcolor="white"
        borderRadius={2}
        boxShadow={2}
        sx={{
          ".slick-slide": { textAlign: "center" },
          ".slick-track": { display: "flex", alignItems: "center" },
        }}
      >
        <Slider slidesToShow={6} arrows={true} responsive={responsive} autoplay>
          {loopedBrands.map((brand, index) => (
            <FlexCenterRow
              key={`${brand.id}-${index}`}
              height={150}
              width="100%"
              sx={{
                position: "relative",
                overflow: "hidden",
                borderRadius: 2,
                transition: "transform 0.3s",
                "&:hover": {
                  transform: "scale(1.05)",
                  boxShadow: 3,
                },
              }}
            >
              <MTImage alt={`Thương hiệu ${brand.id}`} src={brand.image} fill />
            </FlexCenterRow>
          ))}
        </Slider>
      </Box>
    </Container>
  );
}
