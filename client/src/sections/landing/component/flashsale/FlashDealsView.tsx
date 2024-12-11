import BoltIcon from "@mui/icons-material/Bolt";
import { SectionCreator } from "../../../../components/section-header";
import SliderShow from "../../../../components/slider/SliderShow";
import ProductCard2 from "../../../../components/card/productcard1/ProductCard2";
import ProductModel from "../../../../models/Product.model";

type Props = { products: ProductModel[] };

export default function SectionFlashSale({ products }: Props) {
  const responsive = [
    { breakpoint: 950, settings: { slidesToShow: 3 } },
    { breakpoint: 650, settings: { slidesToShow: 2 } },
    { breakpoint: 500, settings: { slidesToShow: 1 } },
  ];

  const calculateOff = (highest: number, lowest: number): number => {
    if (highest === 0) return 0;
    return Math.round(((highest - lowest) / highest) * 100);
  };
  if (!Array.isArray(products) || products.length === 0) {
    return null;
  }

  return (
    <SectionCreator
      icon={<BoltIcon color="primary" />}
      title="Flash Sale"
      seeMoreLink="/flash-sale"
    >
      <SliderShow
        slidesToShow={4}
        responsive={responsive}
        arrowStyles={{ color: "#2B3445", backgroundColor: "white" }}
      >
        {products.map((item) => {
          const thumbnail =
            item.images && item.images.length > 0
              ? item.images[0]
              : "/placeholder.png";
          const off = calculateOff(item.highest_price, item.lowest_price);

          return (
            <ProductCard2
              key={item.id}
              slug={item.slug}
              title={item.name}
              price={item.highest_price}
              discountPrice={item.lowest_price}
              off={off}
              rating={item.review_point}
              imgUrl={thumbnail}
            />
          );
        })}
      </SliderShow>
    </SectionCreator>
  );
}
