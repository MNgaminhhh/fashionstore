import Base from "./Base";

class File extends Base {
  constructor() {
    super({
      url: "file",
    });
  }

  async upload(
    formData: FormData,
    token?: string,
    withCredentials: boolean = true
  ) {
    const rs = await this.execute({
      url: `file/upload`,
      method: "post",
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
      data: formData,
      withCredentials: withCredentials,
    });
    return rs;
  }
}

export default new File();
