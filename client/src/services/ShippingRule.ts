import Base from "./Base";

interface Filters {
  name?: string;
  minOrderCost?: string;
  status?: string;
  price?: string;
}
interface cuShippingRuleModel {
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

class ShippingRuleServer extends Base {
  constructor() {
    super({
      url: "shipping_rules",
    });
  }
  async findOne(id: string) {
    const rs = await this.execute({
      url: `/shipping_rules/${id}`,
      method: "get",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return rs;
  }
  async getAllShippingRule(
    token: string | undefined = undefined,
    withCredentials: boolean = true,
    limit: number = 10,
    page: number = 1,
    filters: Filters = {}
  ) {
    let url = `/shipping_rules?limit=${encodeURIComponent(
      limit
    )}&page=${encodeURIComponent(page)}`;

    const queryParams: string[] = [];

    if (filters.status) {
      queryParams.push(`status=${encodeURIComponent(filters.status)}`);
    }
    if (filters.name) {
      queryParams.push(`name=${encodeURIComponent(filters.name)}`);
    }
    if (filters.price) {
      queryParams.push(`price=${encodeURIComponent(filters.price)}`);
    }
    if (filters.minOrderCost) {
      queryParams.push(
        `minOrderCost=${encodeURIComponent(filters.minOrderCost)}`
      );
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
    data: cuShippingRuleModel,
    token: string | undefined = undefined,
    withCredentials: boolean = true
  ) {
    const rs = await this.execute({
      url: `/shipping_rules`,
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
    data: cuShippingRuleModel,
    token: string | undefined = undefined,
    withCredentials: boolean = true
  ): Promise<any> {
    const rs = await this.execute({
      url: `/shipping_rules/${id}`,
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
    newBoo: boolean,
    token: string | undefined = undefined,
    withCredentials: boolean = true
  ): Promise<any> {
    const rs = await this.execute({
      url: `/shipping_rules/${id}`,
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : undefined,
      },
      data: { status: newBoo },
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
      url: `/shipping_rules/${id}`,
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

const ShippingRule = new ShippingRuleServer();
export default ShippingRule;
