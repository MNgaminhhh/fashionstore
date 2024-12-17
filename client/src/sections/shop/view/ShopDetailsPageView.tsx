"use client";

import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import ProductsGridView from "../../product-detail/components/ProductsGridView";
import ShopIntroCard from "../components/ShopIntroCard";
import VendorModel from "../../../models/Vendor.model";

type Props = { shop: any; vendor: VendorModel; name: string };

export default function ShopDetailsPageView({ shop, vendor, name }: Props) {
  const vendorInfo = vendor ? vendor : null;

  return (
    <Container className="mt-2 mb-3">
      {vendorInfo ? (
        <ShopIntroCard
          name={vendorInfo.store_name}
          phone={vendorInfo.phone_number}
          address={vendorInfo.address}
          coverPicture={vendorInfo.banner}
          profilePicture={vendorInfo.banner}
        />
      ) : (
        <p>Thông tin cửa hàng không có sẵn</p>
      )}

      <Grid container spacing={3}>
        <Grid item md={12} xs={12}>
          <ProductsGridView initialProducts={shop} storeName={name} />
        </Grid>
      </Grid>
    </Container>
  );
}
