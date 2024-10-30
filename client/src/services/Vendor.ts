import Base from "./Base";

class Vendor extends Base {
  constructor() {
    super({
      url: "vendors",
    });
  }

  async findAll(
    token?: string,
    withCredentials: boolean = true,
    limit: number = 8,
    page: number = 1
  ) {
    const rs = await this.execute({
      url: `vendors/?limit=${limit}&page=${page}`,
      method: "get",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      withCredentials: withCredentials,
    });
    return rs;
  }
}

export default new Vendor();
