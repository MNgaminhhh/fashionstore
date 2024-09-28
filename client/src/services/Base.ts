import {BaseApi} from "@mngaminhhh/mn/lib/services";


class Base extends BaseApi {
    constructor(data: any) {
        super({
            ...data,
            timeout: 5000,
        });
    }
}

export default Base;
