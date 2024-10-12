import Base from "./Base";
import { set, get } from "../hooks/useLocalStorage";
import jwt from "jwt-decode";
import {get} from "lodash";

class Auth extends Base {
    constructor() {
        super({
            url: "auth",
        });
    }

    async login(username?: string, password?: string) {
        const rs = await this.execute({
            url: "auth/login",
            method: "post",
            data: {
                password: password,
                username: username,
            },
        });
        if (rs.success) {
            const token = get(rs, "data.access_token");
            set("token", token || "");
        }
        return rs;
    }

    checkLogin(router: any) {
        const token = get("token");
        if (token) {
            const isExpire: any = jwt(token);
            if (isExpire.exp < Date.now() / 1000) {
                router.push("/login");
            }
            return true;
        } else {
            router.push("/login");
        }
    }
}

export default new Auth();
