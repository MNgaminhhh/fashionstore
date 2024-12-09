interface CartModel {
  id: string;
  sku_id: string;
  quantity: number;
  price: number;
  offer_price: number;
  total_price: number;
  total_offer_price: number;
  product_image: string[];
  banner: string;
}

export default CartModel;
