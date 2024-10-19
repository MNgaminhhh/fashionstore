import {BaseApi} from "@mngaminhhh/mn/lib/services";

class Base extends BaseApi {
    constructor(data: any) {
        const baseUrl = process.env.api;
        super({
            ...data,
            baseURL: baseUrl,
            timeout: 7000,
        });
    }
}

export default Base;
