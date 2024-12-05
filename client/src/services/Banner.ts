import Base from "./Base";

interface Filters {
  status?: string;
  title?: string;
  description?: string;
  serial?: string;
  buttonText?: string;
  buttonLink?: string;
}

interface BannerUpdateData {
  serial: number;
  banner_image: string;
  title: string;
  description: string;
  button_text: string;
  button_link: string;
  status: boolean;
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

  async create(
    data: BannerUpdateData,
    token: string | undefined = undefined,
    withCredentials: boolean = true
  ): Promise<any> {
    const rs = await this.execute({
      url: `/banners`,
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

  async getTableFilter(
    token: string | undefined = undefined,
    withCredentials: boolean = true,
    limit: number = 10,
    page: number = 1,
    filters: Filters = {}
  ) {
    let url = `banners?limit=${encodeURIComponent(
      limit
    )}&page=${encodeURIComponent(page)}`;

    const queryParams: string[] = [];

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

    return rs;
  }

  async delete(
    token: string | undefined = undefined,
    withCredentials: boolean = true,
    id: string
  ) {
    const rs = await this.execute({
      url: `/banners/${id}`,
      method: "delete",
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
      url: `/banners/${id}`,
      method: "get",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return rs;
  }

  async update(
    id: string,
    data: BannerUpdateData,
    token: string | undefined = undefined,
    withCredentials: boolean = true
  ): Promise<any> {
    const rs = await this.execute({
      url: `/banners/${id}`,
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
}

export default new Banner();
