import Base from "./Base";
import { set, get as getFromLocalStorage } from "../hooks/useLocalStorage";
import { jwtDecode } from "jwt-decode";
import { get } from "lodash";

class Auth extends Base {
    constructor() {
        super({
            url: "auth",
        });
    }

    async login(email?: string, password?: string) {
        const rs = await this.execute({
            url: "auth/login",
            method: "post",
            data: {
                email: email,
                password: password,
            },
        });

        if (rs.success) {
            const token = get(rs, "data.access_token");
            set("token", token || "");
        }
        return rs;
    }
    async register(email?: string, password?: string, cpassword?: string) {
        const rs = await this.execute({
            url: "auth/register",
            method: "post",
            data: {
                email: email,
                password: password,
                confirm_password: cpassword,
            },
        });
        return rs;
    }
    checkLogin(router: any) {
        const token = getFromLocalStorage("token");

        if (token) {
            try {
                const decodedToken: any = jwtDecode(token);
                if (decodedToken.exp < Date.now() / 1000) {
                    set("token", "");
                    router.push("/login");
                    return false;
                }

                return true;
            } catch (error) {
                set("token", "");
                router.push("/login");
                return false;
            }
        } else {
            router.push("/login");
            return false;
        }
    }
    // async resetPassword(email: string) {
    //     return this.execute({
    //         url: "/auth/forgot-password/send-email",
    //         method: "get",
    //         data: { email },
    //     });
    // }
}

export default new Auth();
