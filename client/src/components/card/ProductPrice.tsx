import Box from "@mui/material/Box";
import {calculateDiscount, formatCurrency} from "../../utils/lib";
import {Paragraph} from "../Typography";
import {FlexBox} from "../flexbox";

type Props = { price: number; discount: number };
export default function ProductPrice({ discount, price }: Props) {
    return (
        <FlexBox alignItems="center" gap={1} mt={0.5}>
            <Paragraph fontWeight={600} color="primary.main">
                {calculateDiscount(price, discount)}
            </Paragraph>

            {discount ? (
                <Box component="del" fontWeight={600} color="grey.600">
                    {formatCurrency(price)}
                </Box>
            ) : null}
        </FlexBox>
    );
}
