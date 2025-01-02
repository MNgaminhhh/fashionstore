import Base from "./Base";
interface Filters {
  name?: string;
  status?: 0 | 1;
  url?: string;
}
interface CategoryUpdateData {
  name: string;
  name_code: string;
  url: string;
  icon: string;
  status: 0 | 1;
}
class CategoriesServer extends Base {
  constructor() {
    super({
      url: "categories",
    });
  }

  async getFullCate() {
    const rs = await this.execute({
      url: `/categories/full-tree`,
      method: "get",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return rs.data;
  }
  async getList(
    token: string | undefined = undefined,
    withCredentials: boolean = true
  ) {
    let url = `/categories/all?status=1`;
    const rs = await this.execute({
      url,
      method: "get",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : undefined,
      },
      withCredentials,
    });

    return rs.data;
  }

  async findAll(
    token?: string,
    withCredentials: boolean = true,
    limit: number = 10,
    page: number = 1,
    filters: Filters = {}
  ): Promise<any> {
    let url = `/categories/all?limit=${limit}&page=${page}`;

    if (filters.name) {
      url += `&name=${encodeURIComponent(filters.name)}`;
    }
    if (filters.status !== undefined) {
      url += `&status=${filters.status}`;
    }
    if (filters.url) {
      url += `&url=${encodeURIComponent(filters.url)}`;
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

  async findOne(id: string) {
    const rs = await this.execute({
      url: `/categories/${id}`,
      method: "get",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return rs.data;
  }

  async update(
    id: string,
    data: any,
    token: string | undefined = undefined,
    withCredentials: boolean = true
  ): Promise<any> {
    const rs = await this.execute({
      url: `/categories/${id}`,
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
    data: any,
    token: string | undefined = undefined,
    withCredentials: boolean = true
  ): Promise<any> {
    const rs = await this.execute({
      url: `/categories/`,
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
      url: `/categories/${id}`,
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

const Categories = new CategoriesServer();
export default Categories;
