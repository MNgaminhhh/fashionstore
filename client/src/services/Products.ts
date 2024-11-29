import Base from "./Base";

interface Filters {
  name?: string;
  store_name?: string;
}
interface CreateProductModel {
  name: string;
  slug: string;
  images: string[];
  category_id: string;
  sub_category_id: string;
  child_category_id: string;
  short_description: string;
  long_description: string;
  product_type: string;
  offer?: number;
  offer_start_date?: Date;
  offer_end_date?: Date;
  status: string;
}

class Products extends Base {
  constructor() {
    super({
      url: "products",
    });
  }

  async getTableFilter(
    token: string | undefined = undefined,
    withCredentials: boolean = true,
    limit: number = 10,
    page: number = 1,
    filters: Filters = {}
  ) {
    let url = `products?limit=${encodeURIComponent(
      limit
    )}&page=${encodeURIComponent(page)}`;

    const queryParams: string[] = [];

    if (filters.name) {
      queryParams.push(`status=${encodeURIComponent(filters.name)}`);
    }
    if (filters.store_name) {
      queryParams.push(`title=${encodeURIComponent(filters.store_name)}`);
    }

    if (queryParams.length > 0) {
      url += `&${queryParams.join("&")}`;
    }
    const rs = await this.execute({
      url,
      method: "get",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : undefined,
      },
      withCredentials: withCredentials,
    });

    return rs;
  }

  async create(
    productData: CreateProductModel,
    token: string | undefined = undefined,
    withCredentials: boolean = true
  ) {
    const rs = await this.execute({
      url: `/products`,
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : undefined,
      },
      data: productData,
      withCredentials: withCredentials,
    });
    return rs;
  }
}

export default new Products();
