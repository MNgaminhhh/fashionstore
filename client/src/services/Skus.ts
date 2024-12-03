import Base from "./Base";

interface Filters {
  name?: string;
  cate_name?: string;
  status?: string;
  product_type?: string;
}
interface cuSkuModel {
  in_stock: string;
  price: string;
  images: string[];
  product_id: string;
  offer?: number;
  offer_start_date?: Date;
  offer_end_date?: Date;
}

class SkusServer extends Base {
  constructor() {
    super({
      url: "skus",
    });
  }
  async findOne(id: string) {
    const rs = await this.execute({
      url: `/skus/${id}`,
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
    let url = `/skus/vendors?limit=${encodeURIComponent(
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

  async create(
    productData: cuSkuModel,
    token: string | undefined = undefined,
    withCredentials: boolean = true
  ) {
    const rs = await this.execute({
      url: `/skus`,
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
    data: cuSkuModel,
    token: string | undefined = undefined,
    withCredentials: boolean = true
  ): Promise<any> {
    const rs = await this.execute({
      url: `/skus/${id}`,
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
      url: `/skus/${id}`,
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
  async delete(
    id: string,
    token: string | undefined = undefined,
    withCredentials: boolean = true
  ) {
    const rs = await this.execute({
      url: `/skus/${id}`,
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

const Skus = new SkusServer();
export default Skus;
