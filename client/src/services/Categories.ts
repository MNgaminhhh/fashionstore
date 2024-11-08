import Base from "./Base";

class Categories extends Base {
  constructor() {
    super({
      url: "categories",
    });
  }

  async getFullCate() {
    const rs = await this.execute({
      url: `categories/full-tree`,
      method: "get",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return rs;
  }
}

export default new Categories();
