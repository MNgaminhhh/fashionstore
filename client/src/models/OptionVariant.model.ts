interface OptionVariantModel {
  id: string;
  name: string;
  product_variant_id: string;
  product_variant: string;
  status: "active" | "inactive";
}

export default OptionVariantModel;
