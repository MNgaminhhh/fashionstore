import Base from "./Base";

interface Filters {
  startDate?: string;
  endDate?: string;
}
interface cuCartModel {
  sku_id: string;
  quantity: number;
}

class OrdersServer extends Base {
  constructor() {
    super({
      url: "order_bills",
    });
  }

  async getAllOrderByVendor(
    token: string | undefined = undefined,
    withCredentials: boolean = true,
    limit: number = 10,
    page: number = 1,
    filters: any = {}
  ) {
    let url = `/order_bills/vendor?limit=${encodeURIComponent(
      limit
    )}&page=${encodeURIComponent(page)}`;
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

  async getAllOrderByAdmin(
    token: string | undefined = undefined,
    withCredentials: boolean = true,
    limit: number = 10,
    page: number = 1,
    filters: any = {}
  ) {
    let url = `/order_bills/admin?limit=${encodeURIComponent(
      limit
    )}&page=${encodeURIComponent(page)}`;
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
  async getAllOrderByUser(
    token: string | undefined = undefined,
    withCredentials: boolean = true
  ) {
    let url = `/order_bills/user`;
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
  async findOne(id: string) {
    let url = `/order_bills/${id}`;
    const rs = await this.execute({
      url,
      method: "get",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return rs.data;
  }
  async updateStatusByVendor(
    id: string,
    status: boolean,
    token: string | undefined = undefined,
    withCredentials: boolean = true
  ) {
    const data = { is_prepared: status };
    const url = `/order_bills/vendor/${id}`;

    const rs = await this.execute({
      url,
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : undefined,
      },
      withCredentials: withCredentials,
      data: data,
    });

    return rs.data;
  }

  async updateStatusByAdmin(
    id: string,
    status: string,
    token: string | undefined = undefined,
    withCredentials: boolean = true
  ) {
    const data = { order_status: status };
    const url = `/order_bills/admin/${id}`;

    const rs = await this.execute({
      url,
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : undefined,
      },
      withCredentials: withCredentials,
      data: data,
    });

    return rs.data;
  }
}

const Orders = new OrdersServer();
export default Orders;
