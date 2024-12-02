interface VariantModel {
  id: string;
  name: string;
  status: "active" | "inactive";
  product_id: string;
  productId?: string;
}

export default VariantModel;
