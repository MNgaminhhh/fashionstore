import Base from "./Base";

class UserServer extends Base {
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

  async updateProfile(
    data: any,
    token?: string,
    withCredentials: boolean = true
  ) {
    const rs = await this.execute({
      url: "user/profile",
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      data: data,
      withCredentials: withCredentials,
    });
    return rs;
  }
}

const User = new UserServer();
export default User;
