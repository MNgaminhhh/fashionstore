import Base from "./Base";

interface Filters {
  visible?: string;
  name?: string;
}
interface BrandUpdateData {
  name: string;
  sequence: number;
  image: string;
  visible: boolean;
}
class Brands extends Base {
  constructor() {
    super({
      url: "brands",
    });
  }

  async findAll(
    token: string | undefined = undefined,
    withCredentials: boolean = true,
    limit: number = 10,
    page: number = 1,
    filters: Filters = {}
  ) {
    let url = `brands/?limit=${limit}&page=${page}`;
    if (filters.visible) {
      url += `&visible=${encodeURIComponent(filters.visible)}`;
    }
    if (filters.name) {
      url += `&name=${encodeURIComponent(filters.name)}`;
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

  async getAllBrands() {
    const rs = await this.execute({
      url: `brands/?visible=true`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return rs;
  }

  async findOne(id: string) {
    const rs = await this.execute({
      url: `brands/${id}`,
      method: "get",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return rs;
  }

  async update(
    id: string,
    data: BrandUpdateData,
    token: string | undefined = undefined,
    withCredentials: boolean = true
  ): Promise<any> {
    const rs = await this.execute({
      url: `/brands/${id}`,
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

  async create(
    data: BrandUpdateData,
    token: string | undefined = undefined,
    withCredentials: boolean = true
  ): Promise<any> {
    const rs = await this.execute({
      url: `/brands/`,
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
    token: string | undefined = undefined,
    withCredentials: boolean = true,
    id: string
  ) {
    const rs = await this.execute({
      url: `/brands/${id}`,
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

export default new Brands();
