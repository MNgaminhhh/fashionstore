import Box from "@mui/material/Box";
import { formatCurrency } from "../../utils/lib";
import { H2, H5 } from "../Typography";

type Props = {
  price: number;
  discountPrice: any;
  nocenter?: boolean;
};

export default function ProductDiscount({ discountPrice, price }: Props) {
  const formattedPrice = formatCurrency(price);
  const formattedDiscountPrice = formatCurrency(discountPrice);

  return (
    <Box display="flex" alignItems="center" gap={1} mt={0.5}>
      <H2 fontWeight={600} color="primary.main">
        {formattedDiscountPrice}
      </H2>
      {discountPrice < price && (
        <Box component="del" fontWeight={600} color="grey.600">
          {formattedPrice}
        </Box>
      )}
    </Box>
  );
}

export function ProductDiscount2({ discountPrice, price, nocenter }: Props) {
  const formattedPrice = formatCurrency(price);
  const formattedDiscountPrice = formatCurrency(discountPrice);

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent={nocenter ? "flex-start" : "center"}
      gap={1}
      mt={0.5}
    >
      <H5
        fontWeight={700}
        py={0.5}
        sx={{ maxHeight: "2.5em", overflow: "hidden" }}
      >
        {formattedDiscountPrice}
      </H5>
      {discountPrice < price && (
        <>
          {" - "}
          <H5
            fontWeight={700}
            py={0.5}
            sx={{ maxHeight: "2.5em", overflow: "hidden" }}
          >
            {formattedPrice}
          </H5>
        </>
      )}
    </Box>
  );
}
