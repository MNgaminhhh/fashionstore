import Base from "./Base";

interface Filters {
  productName?: string;
  show?: string;
}
interface cuFSItemModel {
  flash_sale_id: string;
  product_id: string;
  show: boolean;
}

class FlashSaleItemServer extends Base {
  constructor() {
    super({
      url: "flash-sale-items",
    });
  }
  async findOne(id: string) {
    const rs = await this.execute({
      url: `/flash-sale-items/${id}`,
      method: "get",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return rs;
  }
  async getFlashSaleItems(
    id: string,
    token: string | undefined = undefined,
    withCredentials: boolean = true,
    limit: number = 10,
    page: number = 1,
    filters: Filters = {}
  ) {
    let url = `/flash-sale-items/flash-sale/${id}?limit=${encodeURIComponent(
      limit
    )}&page=${encodeURIComponent(page)}`;

    const queryParams: string[] = [];

    if (filters.productName) {
      queryParams.push(
        `productName=${encodeURIComponent(filters.productName)}`
      );
    }
    if (filters.show) {
      queryParams.push(`show=${encodeURIComponent(filters.show)}`);
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
    data: cuFSItemModel,
    token: string | undefined = undefined,
    withCredentials: boolean = true
  ) {
    const rs = await this.execute({
      url: `/flash-sale-items`,
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
    data: cuFSItemModel,
    token: string | undefined = undefined,
    withCredentials: boolean = true
  ): Promise<any> {
    const rs = await this.execute({
      url: `/flash-sale-items/${id}`,
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
      url: `/flash-sale-items/${id}`,
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : undefined,
      },
      data: { show: newStatus },
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
      url: `/flash-sale-items/${id}`,
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

const FlashSaleItem = new FlashSaleItemServer();
export default FlashSaleItem;
