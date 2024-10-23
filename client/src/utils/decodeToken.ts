import {jwtDecode} from "jwt-decode";

export const decodeToken = (token: string) => {
    try {
        const decoded: any = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decoded.exp < currentTime) {
            return { valid: false };
        }

        return { valid: true };
    } catch (error) {
        return { valid: false };
    }
};
