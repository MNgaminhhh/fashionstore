interface VariantModel {
  id: string;
  name: string;
  status: "active" | "inactive";
  product_id: string;
  variant: any;
  productId?: string;
}

export default VariantModel;
