interface SkuModel {
  id: string;
  sku: string;
  price: any;
  in_stock: string;
  product_id: string;
  variant_options: any;
  offer: any;
  offer_start_date: string;
  offer_end_date: string;
  status: string;
  variants: any;
}

export default SkuModel;
