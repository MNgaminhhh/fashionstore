import Base from "./Base";

interface Filters {
  description?: string;
  status?: string;
  store_name?: string;
  full_name?: string;
  address?: string;
}
class Vendor extends Base {
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
}

export default new Vendor();
