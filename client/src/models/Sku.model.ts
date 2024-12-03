interface SkuModel {
  id: string;
  sku: string;
  price: string;
  in_stock: string;
  product_id: string;
  offer: string;
  offer_start_date: Date;
  offer_end_date: Date;
}

export default SkuModel;
