"use client";

import Grid from "@mui/material/Grid";
import { Theme } from "@mui/material/styles";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import useMediaQuery from "@mui/material/useMediaQuery";
import FilterList from "@mui/icons-material/FilterList";
import ShopIntroCard from "../shop-intro-card";
import ProductFilterCard from "../../product-detail/components/ProductFilterCard";
import SideNav from "../../../components/sidenav";
import ProductsGridView from "../../product-detail/components/ProductsGridView";

// ============================================================
type Props = { shop: any };
// ============================================================

export default function ShopDetailsPageView({ shop }: Props) {
  const isDownMd = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("md")
  );

  return (
    <Container className="mt-2 mb-3">
      <ShopIntroCard
        name={shop.name}
        phone={shop.phone}
        address={shop.address}
        coverPicture={shop.coverPicture}
        profilePicture={shop.profilePicture}
      />

      <Grid container spacing={3}>
        <Grid item md={3} xs={12} sx={{ display: { md: "block", xs: "none" } }}>
          <ProductFilterCard />
        </Grid>

        <Grid item md={9} xs={12}>
          {isDownMd && (
            <SideNav
              position="left"
              handler={(close) => (
                <IconButton sx={{ float: "right" }} onClick={close}>
                  <FilterList fontSize="small" />
                </IconButton>
              )}
            >
              <ProductFilterCard />
            </SideNav>
          )}
          <ProductsGridView products={shop.products.slice(0, 9)} />
        </Grid>
      </Grid>
    </Container>
  );
}
