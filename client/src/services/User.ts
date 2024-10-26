import Base from "./Base";

class User extends Base {
  constructor() {
    super({
      url: "user",
    });
  }

  async profile(token?: string, withCredentials: boolean = true) {
    const rs = await this.execute({
      url: "user/profile",
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

export default new User();
