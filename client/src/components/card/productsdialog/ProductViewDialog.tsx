"use client";
import Grid from "@mui/material/Grid";
import Rating from "@mui/material/Rating";
import Dialog from "@mui/material/Dialog";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import DialogContent from "@mui/material/DialogContent";
import Close from "@mui/icons-material/Close";
import { H2, H6, Paragraph } from "../../Typography";
import SliderShow from "../../slider/SliderShow";
import MTImage from "../../MTImage";
import { formatCurrency } from "../../../utils/lib";
import ProductDiscount from "../ProductDiscount";
import { useRouter } from "next/navigation";
import { Box } from "@mui/material";

interface Props {
  product: any;
  openDialog: boolean;
  handleCloseDialog: () => void;
}

export default function ProductViewDialog(props: Props) {
  const { product, openDialog, handleCloseDialog } = props;
  const router = useRouter();
  const handleView = () => {
    router.push(`/product/${product.slug}`);
  };
  return (
    <Dialog
      open={openDialog}
      maxWidth={false}
      onClose={handleCloseDialog}
      sx={{ zIndex: 1501 }}
    >
      <DialogContent
        sx={{ maxWidth: 900, width: "100%", position: "relative" }}
      >
        <Grid container spacing={3}>
          <Grid item md={6} xs={12}>
            <SliderShow
              slidesToShow={1}
              arrowStyles={{
                boxShadow: 0,
                color: "primary.main",
                backgroundColor: "transparent",
              }}
              infinite={product.images.length > 1}
            >
              {product.images.map((item: string, index: number) => (
                <MTImage
                  key={index}
                  src={item}
                  alt={product.name}
                  sx={{
                    mx: "auto",
                    width: "100%",
                    objectFit: "contain",
                    height: { sm: 400, xs: 250 },
                  }}
                />
              ))}
            </SliderShow>
          </Grid>

          <Grid item md={6} xs={12} alignSelf="center">
            <H2>{product.name}</H2>

            <Paragraph py={1} color="grey.500" fontWeight={600} fontSize={13}>
              DANH MỤC: {product.category_name} &gt; {product.sub_cate_name}{" "}
              &gt; {product.child_cate_name}
            </Paragraph>
            {product.highest_price != product.lowest_price ? (
              <ProductDiscount
                price={product.highest_price}
                discountPrice={product.lowest_price}
              ></ProductDiscount>
            ) : (
              <H2 color="primary.main">
                {formatCurrency(product.lowest_price)}
              </H2>
            )}

            <Box display="flex" alignItems="center" gap={1} mt={1}>
              {product.reviews ? (
                <>
                  <Rating
                    color="warning"
                    value={product.reviews.rating || 0}
                    readOnly
                  />
                  <H6 lineHeight="1">({product.reviews.count || 0})</H6>
                </>
              ) : (
                <Rating color="warning" value={product.review_point} readOnly />
              )}
            </Box>

            <Divider sx={{ mb: 2 }} />
            <Button
              size="large"
              color="dark"
              variant="contained"
              onClick={handleView}
              sx={{ height: 45, borderRadius: 2 }}
            >
              Xem chi tiết
            </Button>
          </Grid>
        </Grid>
        <IconButton
          sx={{ position: "absolute", top: 16, right: 16 }}
          onClick={handleCloseDialog}
        >
          <Close fontSize="small" color="secondary" />
        </IconButton>
      </DialogContent>
    </Dialog>
  );
}
