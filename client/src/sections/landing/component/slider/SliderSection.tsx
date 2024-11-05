"use client";
import Container from "@mui/material/Container";
import { carouselData } from "./data"; // Đảm bảo đường dẫn đúng
import SliderCard from "../../../../components/slidercard";
import SliderShow from "../../../../components/slider/SliderShow";

export default function SliderSection() {
  return (
    <div className="bg-white mb-4">
      <Container className="pt-2 pb-2">
        <SliderShow slidesToShow={1} arrows={false} dots autoplay>
          {carouselData.map((data, ind) => (
            <SliderCard {...data} key={ind} />
          ))}
        </SliderShow>
      </Container>
    </div>
  );
}
