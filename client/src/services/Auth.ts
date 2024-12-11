import Base from "./Base";

class AuthServer extends Base {
  constructor() {
    super({
      url: "auth",
    });
  }

  async login(
    email?: string,
    password?: string,
    withCredentials: boolean = true
  ) {
    const rs = await this.execute({
      url: "auth/login",
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        email,
        password,
      },
      withCredentials: withCredentials,
    });
    return rs;
  }
  async logout() {
    const rs = await this.execute({
      url: "/auth/logout",
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return rs;
  }
  async register(email?: string, password?: string, confirm_password?: string) {
    const rs = await this.execute({
      url: "auth/register",
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        email,
        password,
        confirm_password,
      },
    });
    return rs;
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

  async resendVerifyAccount(email: string) {
    const rs = await this.execute({
      url: "auth/verify-email/resend",
      method: "post",
      data: {
        email: email,
      },
    });
    return rs;
  }

  async resetPassword(
    new_password: string,
    confirm_password: string,
    token: string
  ) {
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

const Auth = new AuthServer();
export default Auth;
