import Base from "./Base";

interface Filters {
  name?: string;
  status?: string;
  discount?: string;
  max_price?: string;
  quantity?: string;
  code?: string;
  type?: string;
}
interface cuCouponsModel {
  code: string;
  quantity: string;
  start_date: string;
  end_date: string;
  type: string;
  discount: string;
  max_price: string;
  name: string;
  condition: any;
}

class CouponsServer extends Base {
  constructor() {
    super({
      url: "coupons",
    });
  }
  async findOne(id: string) {
    const rs = await this.execute({
      url: `/coupons/${id}`,
      method: "get",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return rs;
  }
  async getAllCoupons(
    token: string | undefined = undefined,
    withCredentials: boolean = true,
    limit: number = 10,
    page: number = 1,
    filters: Filters = {}
  ) {
    let url = `/coupons?limit=${encodeURIComponent(
      limit
    )}&page=${encodeURIComponent(page)}`;

    const queryParams: string[] = [];

    if (filters.name) {
      queryParams.push(`name=${encodeURIComponent(filters.name)}`);
    }
    if (filters.code) {
      queryParams.push(`code=${encodeURIComponent(filters.code)}`);
    }
    if (filters.type) {
      queryParams.push(`type=${encodeURIComponent(filters.type)}`);
    }
    if (filters.quantity) {
      queryParams.push(`quantity=${encodeURIComponent(filters.quantity)}`);
    }
    if (filters.discount) {
      queryParams.push(`discount=${encodeURIComponent(filters.discount)}`);
    }
    if (filters.max_price) {
      queryParams.push(`maxPrice=${encodeURIComponent(filters.max_price)}`);
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
    data: cuCouponsModel,
    token: string | undefined = undefined,
    withCredentials: boolean = true
  ) {
    const rs = await this.execute({
      url: `/coupons`,
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
    data: cuCouponsModel,
    token: string | undefined = undefined,
    withCredentials: boolean = true
  ): Promise<any> {
    const rs = await this.execute({
      url: `/coupons/${id}`,
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
    newStatus: boolean,
    token: string | undefined = undefined,
    withCredentials: boolean = true
  ): Promise<any> {
    const rs = await this.execute({
      url: `/coupons/status/${id}`,
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
      url: `/coupons/${id}`,
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

const Coupons = new CouponsServer();
export default Coupons;
