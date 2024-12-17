import { BaseApi } from "@mngaminhhh/mn/dist/services";
import { AxiosRequestConfig } from "axios";

class Base extends BaseApi {
  constructor(data: any) {
    const baseUrl = process.env.api;
    super({
      ...data,
      baseURL: baseUrl,
      timeout: 7000,
      withCredentials: true,
    });
  }
  protected execute<T = any>(config: AxiosRequestConfig) {
    return super.execute<T>(config);
  }
}

export default Base;
