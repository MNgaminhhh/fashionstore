import Base from "./Base";

interface Filters {
  sku?: string;
  offer?: string;
  offerPrice?: string;
  status?: string;
  price?: string;
  productName?: string;
  productId?: string;
}
interface cuSkuModel {
  sku: string;
  variant_options: any;
  status: any;
  in_stock: string;
  price: string;
  images: string[];
  product_id: string;
  offer?: number;
  offer_start_date?: string;
  offer_end_date?: string;
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

    if (filters.sku) {
      queryParams.push(`sku=${encodeURIComponent(filters.sku)}`);
    }
    if (filters.offer) {
      queryParams.push(`offer=${encodeURIComponent(filters.offer)}`);
    }
    if (filters.offerPrice) {
      queryParams.push(`offerPrice=${encodeURIComponent(filters.offerPrice)}`);
    }
    if (filters.status) {
      queryParams.push(`status=${encodeURIComponent(filters.status)}`);
    }
    if (filters.price) {
      queryParams.push(`price=${encodeURIComponent(filters.price)}`);
    }
    if (filters.productName) {
      queryParams.push(
        `productName=${encodeURIComponent(filters.productName)}`
      );
    }
    if (filters.productId) {
      queryParams.push(`productId=${encodeURIComponent(filters.productId)}`);
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
    data: any,
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
      data: data,
      withCredentials: withCredentials,
    });
    return rs;
  }

  async update(
    id: string,
    data: any,
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
