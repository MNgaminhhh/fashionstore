interface ShippingRuleModel {
  id: string;
  name: string;
  min_order_cost: number;
  price: number;
  status: boolean;
  created_at: string;
  updated_at: string;
}

export default ShippingRuleModel;
