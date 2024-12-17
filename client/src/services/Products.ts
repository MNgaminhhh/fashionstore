import Base from "./Base";

interface Filters {
  name?: string;
  cate_name?: string;
  status?: string;
  product_type?: string;
}

interface Filterss {
  name?: string;
  store_name?: string;
  status?: string;
  product_type?: string;
  low_price?: string;
  high_price?: string;
  cate_name?: string;
  is_approved?: string;
  child_cate_name?: string;
  sub_cate_name?: string;
}
interface cuProductModel {
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

class ProductsServer extends Base {
  constructor() {
    super({
      url: "products",
    });
  }
  async findOne(id: string) {
    const rs = await this.execute({
      url: `/products/${id}`,
      method: "get",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return rs;
  }
  async getByVendor(
    token: string | undefined = undefined,
    withCredentials: boolean = true,
    limit: number = 10,
    page: number = 1,
    filters: Filters = {}
  ) {
    let url = `/products/vendor?limit=${encodeURIComponent(
      limit
    )}&page=${encodeURIComponent(page)}`;

    const queryParams: string[] = [];

    if (filters.name) {
      queryParams.push(`name=${encodeURIComponent(filters.name)}`);
    }
    if (filters.cate_name) {
      queryParams.push(`cate_name=${encodeURIComponent(filters.cate_name)}`);
    }
    if (filters.product_type) {
      queryParams.push(
        `product_type=${encodeURIComponent(filters.product_type)}`
      );
    }
    if (filters.status) {
      queryParams.push(`status=${encodeURIComponent(filters.status)}`);
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

    return rs.data;
  }

  async getAllProduct(
    limit: number = 10,
    page: number = 1,
    filters: Filterss = {}
  ) {
    let url = `/products?limit=${encodeURIComponent(
      limit
    )}&page=${encodeURIComponent(page)}`;

    const queryParams: string[] = [];
    if (filters.store_name) {
      queryParams.push(`store_name=${encodeURIComponent(filters.store_name)}`);
    }
    if (filters.low_price) {
      queryParams.push(`low_price=${encodeURIComponent(filters.low_price)}`);
    }
    if (filters.high_price) {
      queryParams.push(`high_price=${encodeURIComponent(filters.high_price)}`);
    }
    if (filters.is_approved) {
      queryParams.push(
        `is_approved=${encodeURIComponent(filters.is_approved)}`
      );
    }
    if (filters.name) {
      queryParams.push(`name=${encodeURIComponent(filters.name)}`);
    }
    if (filters.cate_name) {
      queryParams.push(`cate_name=${encodeURIComponent(filters.cate_name)}`);
    }
    if (filters.product_type) {
      queryParams.push(
        `product_type=${encodeURIComponent(filters.product_type)}`
      );
    }
    if (filters.sub_cate_name) {
      queryParams.push(
        `sub_cate_name=${encodeURIComponent(filters.sub_cate_name)}`
      );
    }
    if (filters.child_cate_name) {
      queryParams.push(
        `child_cate_name=${encodeURIComponent(filters.child_cate_name)}`
      );
    }
    if (filters.status) {
      queryParams.push(`status=${encodeURIComponent(filters.status)}`);
    }
    if (queryParams.length > 0) {
      url += `&${queryParams.join("&")}`;
    }
    const rs = await this.execute({
      url,
      method: "get",
    });

    return rs;
  }

  async getByListProduct() {
    let url = `/products`;
    const rs = await this.execute({
      url,
      method: "get",
    });

    return rs.data;
  }

  async getDetailProduct(slug: string) {
    let url = `/products/detail/${slug}`;
    const rs = await this.execute({
      url,
      method: "get",
    });

    return rs.data;
  }
  async create(
    productData: cuProductModel,
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

  async update(
    id: string,
    data: cuProductModel,
    token: string | undefined = undefined,
    withCredentials: boolean = true
  ): Promise<any> {
    const rs = await this.execute({
      url: `/products/${id}`,
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : undefined,
      },
      data: data,
      withCredentials: withCredentials,
    });
    return rs;
  }
  async updateStatus(
    id: string,
    newStatus: "active" | "inactive",
    token: string | undefined = undefined,
    withCredentials: boolean = true
  ): Promise<any> {
    const rs = await this.execute({
      url: `/products/${id}`,
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : undefined,
      },
      data: { status: newStatus },
      withCredentials: withCredentials,
    });
    return rs;
  }
  async updateApproval(
    id: string,
    newStatus: boolean,
    token: string | undefined = undefined,
    withCredentials: boolean = true
  ): Promise<any> {
    const rs = await this.execute({
      url: `/products/${id}`,
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : undefined,
      },
      data: { is_approved: newStatus },
      withCredentials: withCredentials,
    });
    return rs;
  }
  async updateProductType(
    id: string,
    productType: string,
    token: string | undefined = undefined,
    withCredentials: boolean = true
  ): Promise<any> {
    const rs = await this.execute({
      url: `/products/${id}`,
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : undefined,
      },
      data: { product_type: productType },
      withCredentials: withCredentials,
    });
    return rs;
  }
  async delete(
    id: string,
    token: string | undefined = undefined,
    withCredentials: boolean = true
  ) {
    const rs = await this.execute({
      url: `/products/${id}`,
      method: "delete",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : undefined,
      },
      withCredentials: withCredentials,
    });

    return rs;
  }
}

const Products = new ProductsServer();
export default Products;
