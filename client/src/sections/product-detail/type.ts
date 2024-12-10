export interface ProductFilters {
  productType: any;
  price: number[];
  category: any;
}

export type ProductFilterKeys = keyof ProductFilters;
export type ProductFilterValues = ProductFilters[ProductFilterKeys];
