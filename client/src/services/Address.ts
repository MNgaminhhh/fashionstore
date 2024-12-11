import Base from "./Base";

interface cuAddressModel {
  address: string;
  email: string;
  phone_number: string;
  receiver_name: string;
}

class AddressServer extends Base {
  constructor() {
    super({
      url: "delivery_info",
    });
  }
  async findOne(id: string, token) {
    const rs = await this.execute({
      url: `/delivery_info/${id}`,
      method: "get",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    });
    return rs;
  }
  async getListAddress(
    token: string | undefined = undefined,
    withCredentials: boolean = true
  ) {
    const rs = await this.execute({
      url: `/delivery_info`,
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
    data: cuAddressModel,
    token: string | undefined = undefined,
    withCredentials: boolean = true
  ) {
    const rs = await this.execute({
      url: `/delivery_info`,
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
    data: cuAddressModel,
    token: string | undefined = undefined,
    withCredentials: boolean = true
  ): Promise<any> {
    const rs = await this.execute({
      url: `/delivery_info/${id}`,
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

  async delete(
    id: string,
    token: string | undefined = undefined,
    withCredentials: boolean = true
  ) {
    const rs = await this.execute({
      url: `/delivery_info/${id}`,
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

const Address = new AddressServer();
export default Address;
