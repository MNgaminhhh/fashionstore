import Base from "./Base";

interface Filters {
  description?: string;
  status?: string;
  store_name?: string;
  full_name?: string;
  address?: string;
}
class VendorServer extends Base {
  constructor() {
    super({
      url: "vendors",
    });
  }

  async findAll(
    token: string | undefined = undefined,
    withCredentials: boolean = true,
    limit: number = 10,
    page: number = 1,
    filters: Filters = {}
  ) {
    let url = `vendors/?limit=${limit}&page=${page}`;
    if (filters.description) {
      url += `&description=${encodeURIComponent(filters.description)}`;
    }
    if (filters.status) {
      url += `&status=${encodeURIComponent(filters.status)}`;
    }
    if (filters.store_name) {
      url += `&store_name=${encodeURIComponent(filters.store_name)}`;
    }
    if (filters.full_name) {
      url += `&full_name=${encodeURIComponent(filters.full_name)}`;
    }
    if (filters.address) {
      url += `&address=${encodeURIComponent(filters.address)}`;
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

  async getList(
    token: string | undefined = undefined,
    withCredentials: boolean = true,
    filters: Filters = {}
  ) {
    let url = `vendors/?`;
    const filterParams: string[] = [];
    if (filters.status) {
      filterParams.push(`status=${encodeURIComponent(filters.status)}`);
    }
    if (filters.store_name) {
      filterParams.push(`store_name=${encodeURIComponent(filters.store_name)}`);
    }
    if (filterParams.length > 0) {
      url += filterParams.join("&");
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

  async findOne(id: string) {
    const rs = await this.execute({
      url: `vendors/${id}`,
      method: "get",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return rs;
  }
  async becomeVendor(data: any, token?: string) {
    const rs = await this.execute({
      url: `/vendors/new`,
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : undefined,
      },
      data,
    });
    return rs;
  }
  async updateStatus(
    data: {
      user_id: string;
      status: string;
    },
    token?: string
  ): Promise<any> {
    const rs = await this.execute({
      url: `vendors/status`,
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : undefined,
      },
      data,
    });
    return rs.data;
  }
}
const Vendor = new VendorServer();
export default Vendor;
