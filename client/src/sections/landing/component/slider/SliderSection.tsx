import Container from "@mui/material/Container";
import SliderCard from "../../../../components/slidercard";
import SliderShow from "../../../../components/slider/SliderShow";
import Banner from "../../../../services/Banner";
import { get } from "lodash";
import { carouselData } from "./data";

export default async function SliderSection() {
  const bannerData = await Banner.findAllTrue();
  const banners = get(bannerData, "data.data", []);

  const validBanners =
    Array.isArray(banners) && banners.length > 0 ? banners : carouselData;
  const shouldInfinite = validBanners.length > 1;
  return (
    <div>
      <Container className="pt-2 pb-2">
        <SliderShow
          slidesToShow={1}
          arrows={false}
          dots
          autoplay
          infinite={shouldInfinite}
        >
          {validBanners.map((data, ind) => (
            <SliderCard {...data} key={ind} />
          ))}
        </SliderShow>
      </Container>
    </div>
  );
}
