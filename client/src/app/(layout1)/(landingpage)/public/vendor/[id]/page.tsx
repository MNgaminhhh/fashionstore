import { Metadata } from "next";
import { get } from "lodash";
import { notFound } from "next/navigation";
import Products from "../../../../../../services/Products";
import ProductSearchPageView from "../../../../../../sections/product-detail/view/ProductSearchPageView";
import { ShopDetailsPageView } from "../../../../../../sections/shop/view";
import Vendor from "../../../../../../services/Vendor";

export const metadata: Metadata = {
  title: "Tất Cả Sản Phẩm | MTShop",
  description: "Tất Cả Sản Phẩm trong MTShop",
  keywords: ["e-commerce", "MTShop"],
};

const ProductSearch = async ({ params }) => {
  try {
    const filters = { store_name: params.id };
    const productResponse = await Products.getAllProduct(10, 1, filters);
    const initialProducts = get(productResponse, "data.data", []);

    const vendorInfor = await Vendor.findAll("123", true, 1, 1, filters);
    const initialVendor = get(vendorInfor, "data.data.vendors", []);

    return (
      <ShopDetailsPageView
        shop={initialProducts}
        vendor={initialVendor}
        name={params.id}
      />
    );
  } catch (error) {
    notFound();
  }
};

export default ProductSearch;
