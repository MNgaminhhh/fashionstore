import Base from "./Base";
interface VariantIn {
  name: string;
  status: string;
  product_id: string;
}
interface Filters {
  name?: string;
  status?: string;
  productId?: string;
}
class VariantServer extends Base {
  constructor() {
    super({
      url: "/product-variants",
    });
  }

  async getVariantByProduct(
    token: string | undefined = undefined,
    withCredentials: boolean = true,
    limit: number = 10,
    page: number = 1,
    filters: Filters = {}
  ) {
    let url = `/product-variants?limit=${encodeURIComponent(
      limit
    )}&page=${encodeURIComponent(page)}`;

    const queryParams: string[] = [];

    if (filters.name) {
      queryParams.push(`name=${encodeURIComponent(filters.name)}`);
    }
    if (filters.productId) {
      queryParams.push(`productId=${encodeURIComponent(filters.productId)}`);
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

  async getListVariantByProduct(
    id: string,
    token: string | undefined = undefined,
    withCredentials: boolean = true
  ) {
    let url = `/product-variants?productId=${encodeURIComponent(id)}`;

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
    data: VariantIn,
    token: string | undefined = undefined,
    withCredentials: boolean = true
  ) {
    const rs = await this.execute({
      url: `/product-variants`,
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
    data: VariantIn,
    token: string | undefined = undefined,
    withCredentials: boolean = true
  ): Promise<any> {
    const rs = await this.execute({
      url: `/product-variants/${id}`,
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
  async findOne(id: string) {
    const rs = await this.execute({
      url: `/product-variants/${id}`,
      method: "get",
      headers: {
        "Content-Type": "application/json",
      },
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
      url: `/product-variants/${id}`,
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
      url: `/product-variants/${id}`,
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

const Variant = new VariantServer();
export default Variant;
