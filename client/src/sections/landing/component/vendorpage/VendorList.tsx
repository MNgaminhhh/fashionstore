import Grid from "@mui/material/Grid";
import VendorModel from "../../../../models/Vendor.model";
import CardVendor from "../../../../components/card/vendorcard/CardVendor";

type Props = { vendors: VendorModel[] };

export default function VendorList({ vendors }: Props) {
    if (!Array.isArray(vendors)) {
        return <div>Không có dữ liệu nhà cung cấp</div>;
    }

    return (
        <Grid container spacing={3} minHeight={500}>
            {vendors.map((vendor) => (
                <Grid item lg={3} md={4} sm={6} xs={12} key={vendor.id}>
                    <CardVendor
                        id={vendor.id}
                        storeName={vendor.store_name}
                        address={vendor.address}
                        banner={vendor.banner}
                        description={vendor.description}
                    />
                </Grid>
            ))}
        </Grid>
    );
}
