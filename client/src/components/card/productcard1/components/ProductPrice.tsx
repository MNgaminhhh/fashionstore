import Box from "@mui/material/Box";
import { calculateDiscount, formatCurrency } from "../../../../utils/lib";
import { Paragraph } from "../../../Typography";
import { FlexBox } from "../../../flexbox";

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
