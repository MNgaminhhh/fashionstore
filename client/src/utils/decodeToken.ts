import { jwtDecode } from "jwt-decode";

export const decodeToken = (token: string) => {
  try {
    const decoded: any = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    if (decoded.exp < currentTime) {
      return { valid: false, email: decoded.email || null };
    }

    return { valid: true, email: decoded.email || null };
  } catch (error) {
    return { valid: false, email: null };
  }
};
