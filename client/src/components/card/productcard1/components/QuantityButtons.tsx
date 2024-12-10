import Button from "@mui/material/Button";
import { FlexBox } from "../../../flexbox";
import PreviewIcon from "@mui/icons-material/Preview";
import Link from "next/link";

interface Props {
  quantity: number;
  slug: string;
}

export default function QuantityButtons(props: Props) {
  const { quantity, slug } = props || {};

  return (
    <FlexBox
      width="30px"
      alignItems="center"
      className="add-cart"
      flexDirection="column-reverse"
      justifyContent={quantity ? "space-between" : "flex-start"}
    >
      <Link href={`/product/${slug}`} style={{ textDecoration: "none" }}>
        <Button color="primary" variant="outlined" sx={{ padding: "3px" }}>
          <PreviewIcon fontSize="small" />
        </Button>
      </Link>
    </FlexBox>
  );
}
