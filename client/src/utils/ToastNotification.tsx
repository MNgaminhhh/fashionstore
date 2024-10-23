import { toast } from "react-hot-toast";

export const notifySuccess = (message: string) => {
    toast.success(message, {
        position: "top-right",
        duration: 4000,
    });
};

export const notifyError = (message: string) => {
    toast.error(message, {
        position: "top-right",
        duration: 4000,
    });
};

export const notifyInfo = (message: string) => {
    toast(message, {
        position: "top-right",
        duration: 4000,
    });
};
