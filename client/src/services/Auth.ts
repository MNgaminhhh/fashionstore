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
            headers: {
                "Content-Type": "application/json"
            },
            data: {
                email,
                password,
            },
        });

        if (rs.success) {
            const token = get(rs, "data.access_token");
            set("token", token || "");
        }
        return rs;
    }
    async register(email?: string, password?: string, confirm_password?: string) {
        const rs = await this.execute({
            url: "auth/register",
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            data: {
                email,
                password,
                confirm_password,
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

    async verifyAccount(email?: string, status?: string) {
        const formData = new FormData();
        formData.append("email", email || "");
        formData.append("status", status || "active");

        const rs = await this.execute({
            url: "auth/update-status",
            method: "put",
            headers: {
                "Content-Type": "multipart/form-data",
            },
            data: formData,
        });

        return rs;
    }

    async resendVerifyAccount(email:string){
        const rs = await this.execute({
            url: "auth/verify-email/resend",
            method: "post",
            data: {
                email: email,
            },
        });
        return rs;
    }
    // "new_password": "ad123",
    // "confirm_password": "ad123"
    async resetPassword(new_password: string, confirm_password: string, token: string) {
        const rs = await this.execute({
            url: `auth/forgot-password?token=${token}`,
            method: "put",
            data: {
                new_password,
                confirm_password,
            },
        });
        return rs;
    }

    async sendEmailResetPassword(email: string) {
        const rs = await this.execute({
            url: `auth/forgot-password/send-email`,
            method: "post",
            data: {
                email,
            },
        });
        return rs;
    }
}

export default new Auth();
