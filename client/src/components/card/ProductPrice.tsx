import Box from "@mui/material/Box";
import { FlexBox } from "../flexbox";
import { Paragraph } from "../Typography";
import { calculateDiscount, formatCurrency } from "../../utils/lib";

type Props = { price: number; off: number };

export default function ProductPrice({ price, off }: Props) {
  return (
    <FlexBox gap={1} alignItems="center">
      <Paragraph fontWeight="600" color="primary.main">
        {calculateDiscount(price, off)}
      </Paragraph>

      {off ? (
        <Box component="del" fontWeight="600" color="grey.600">
          {formatCurrency(price)}
        </Box>
      ) : null}
    </FlexBox>
  );
}
