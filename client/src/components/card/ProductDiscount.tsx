import Box from "@mui/material/Box";
import { formatCurrency } from "../../utils/lib";
import { H2, Paragraph } from "../Typography";
import { FlexBox } from "../flexbox";

type Props = { price: number; discountPrice: number };

export default function ProductDiscount({ discountPrice, price }: Props) {
  return (
    <FlexBox alignItems="center" gap={1} mt={0.5}>
      <H2 fontWeight={600} color="primary.main">
        {formatCurrency(discountPrice)}
      </H2>

      {discountPrice ? (
        <Box component="del" fontWeight={600} color="grey.600">
          {formatCurrency(price)}
        </Box>
      ) : null}
    </FlexBox>
  );
}
