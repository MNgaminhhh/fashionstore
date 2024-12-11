"use client";

import Grid from "@mui/material/Grid";
import { Theme } from "@mui/material/styles";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import useMediaQuery from "@mui/material/useMediaQuery";
import FilterList from "@mui/icons-material/FilterList";
import ProductFilterCard from "../../product-detail/components/ProductFilterCard";
import SideNav from "../../../components/sidenav";
import ProductsGridView from "../../product-detail/components/ProductsGridView";
import ShopIntroCard from "../components/ShopIntroCard";
import VendorModel from "../../../models/Vendor.model";

type Props = { shop: any; vendor: VendorModel; name: string };

export default function ShopDetailsPageView({ shop, vendor, name }: Props) {
  const isDownMd = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("md")
  );
  return (
    <Container className="mt-2 mb-3">
      <ShopIntroCard
        name={vendor[0].store_name}
        phone={vendor[0].phone_number}
        address={vendor[0].address}
        coverPicture={vendor[0].banner}
        profilePicture={vendor[0].banner}
      />

      <Grid container spacing={3}>
        <Grid item md={12} xs={12}>
          <ProductsGridView initialProducts={shop} storeName={name} />
        </Grid>
      </Grid>
    </Container>
  );
}
