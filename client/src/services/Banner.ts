import Base from "./Base";

interface Filters {
  status?: string;
  title?: string;
  description?: string;
  limit?: string;
  page?: string;
  serial?: string;
  buttonText?: string;
  buttonLink?: string;
}

class Banner extends Base {
  constructor() {
    super({
      url: "banners",
    });
  }

  async findAllTrue() {
    const rs = await this.execute({
      url: `/banners/active`,
      method: "get",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return rs;
  }

  async getTableFilter(
    token: string | undefined = undefined,
    withCredentials: boolean = true,
    filters: Filters = {}
  ) {
    const queryParams: string[] = [];

    if (filters.limit) {
      queryParams.push(`limit=${encodeURIComponent(filters.limit)}`);
    }
    if (filters.page) {
      queryParams.push(`page=${encodeURIComponent(filters.page)}`);
    }
    if (filters.status) {
      queryParams.push(`status=${encodeURIComponent(filters.status)}`);
    }
    if (filters.title) {
      queryParams.push(`title=${encodeURIComponent(filters.title)}`);
    }
    if (filters.description) {
      queryParams.push(
        `description=${encodeURIComponent(filters.description)}`
      );
    }
    if (filters.serial) {
      queryParams.push(`serial=${encodeURIComponent(filters.serial)}`);
    }
    if (filters.buttonText) {
      queryParams.push(`buttonText=${encodeURIComponent(filters.buttonText)}`);
    }
    if (filters.buttonLink) {
      queryParams.push(`buttonLink=${encodeURIComponent(filters.buttonLink)}`);
    }
    const queryString =
      queryParams.length > 0 ? `?${queryParams.join("&")}` : "";
    const url = `brands/${queryString}`;

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
}

export default new Banner();
