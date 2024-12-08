interface ProductModel {
  id: string;
  images: any;
  slug: string;
  name: string;
  sku: string;
  qty: number;
  price: string;
  category_name: string;
  store_name: string;
  product_type: string;
  is_approved: boolean;
  vendor_id: string;
  category_id: string;
  sub_category_id: string;
  child_category_id: string;
  short_description: string;
  lowest_price: string;
  highest_price: string;
  long_description: string;
  offer: number;
  offer_start_date: Date;
  offer_end_date: Date;
  status: string;
  vendor: any;
}

export default ProductModel;
