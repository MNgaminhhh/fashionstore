import Container from "@mui/material/Container";
import SliderCard from "../../../../components/slidercard";
import SliderShow from "../../../../components/slider/SliderShow";
import Banner from "../../../../services/Banner";
import { get } from "lodash";

export default async function SliderSection() {
  const bannerData = await Banner.findAllTrue();
  const banners = get(bannerData, "data.data", []);
  return (
    <div>
      <Container className="pt-2 pb-2">
        <SliderShow slidesToShow={1} arrows={false} dots autoplay>
          {banners.map((data, ind) => (
            <SliderCard {...data} key={ind} />
          ))}
        </SliderShow>
      </Container>
    </div>
  );
}
