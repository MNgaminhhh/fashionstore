import Base from "./Base";

interface Filters {
  startDate?: string;
  endDate?: string;
}
interface cuCartModel {
  sku_id: string;
  quantity: number;
}

class ReviewServer extends Base {
  constructor() {
    super({
      url: "cart",
    });
  }

  async getAllCart(
    token: string | undefined = undefined,
    withCredentials: boolean = true
  ) {
    let url = `/cart`;
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
    data: cuCartModel,
    token: string | undefined = undefined,
    withCredentials: boolean = true
  ) {
    const rs = await this.execute({
      url: `/cart`,
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

  async delete(
    id: string,
    token: string | undefined = undefined,
    withCredentials: boolean = true
  ) {
    const rs = await this.execute({
      url: `/cart/${id}`,
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

const Review = new ReviewServer();
export default Review;