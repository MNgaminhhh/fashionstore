import {BaseApi} from "@mngaminhhh/mn/dist/services";

class Base extends BaseApi {
    constructor(data: any) {
        const baseUrl = process.env.api;
        super({
            ...data,
            baseURL: baseUrl,
            timeout: 7000,
            withCredentials: true
        });
    }
}

export default Base;
