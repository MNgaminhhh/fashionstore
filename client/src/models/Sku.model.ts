interface SkuModel {
  id: string;
  sku: string;
  price: string;
  in_stock: string;
  product_id: string;
  variant_options: any;
  offer: string;
  offer_start_date: string;
  offer_end_date: string;
}

export default SkuModel;
