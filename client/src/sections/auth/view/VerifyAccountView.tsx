"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { notifyError, notifySuccess } from "../../../utils/ToastNotification";
import Auth from "../../../services/Auth";
import { H3 } from "../../../components/Typography";
import { decodeToken } from "../../../utils/decodeToken";

export const VerifyAccountView = () => {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState<string | null>(null);
  const [resend, setResend] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const tokenFromUrl = searchParams.get("token");

    if (tokenFromUrl) {
      const { valid, email: emailFromToken } = decodeToken(tokenFromUrl);
      console.log("Token valid:", valid);
      console.log("Email from token:", emailFromToken);

      if (!valid) {
        setEmail(emailFromToken);
        setMessage("URL đã hết hạn hoặc không hợp lệ!");
        setResend(true);
        setLoading(false);
        return;
      }

      setEmail(emailFromToken);
      verifyAccount(emailFromToken);
    } else {
      setMessage("Không tìm thấy đường dẫn phù hợp...");
      setResend(true);
      setLoading(false);
    }
  }, [searchParams]);

  const verifyAccount = async (email: string | null) => {
    if (!email) {
      setMessage("Không tìm thấy email hợp lệ!");
      setLoading(false);
      return;
    }

    try {
      const response = await Auth.verifyAccount(email, "active");
      if (response.data.success) {
        notifySuccess("Tài khoản của bạn đã được xác minh thành công!");
        await router.push("/login");
      } else {
        notifyError("Xác minh không thành công!");
      }
    } catch (error) {
      notifyError("Đã xảy ra lỗi trong quá trình xác minh!");
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!email) {
      notifyError("Không tìm thấy email để gửi lại mã xác minh.");
      return;
    }

    try {
      setLoading(true);
      const response = await Auth.resendVerifyAccount(email);
      if (response.data.success) {
        notifySuccess("Đường dẫn xác minh đã được gửi lại!");
      } else {
        notifyError(
          response.data.message || "Gửi lại xác minh không thành công."
        );
      }
    } catch (error) {
      notifyError("Đã xảy ra lỗi khi gửi lại xác minh.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    >
      <H3 mb={3} textAlign="center">
        {message || `Xác minh tài khoản cho email: ${email}`}
      </H3>
      {resend && email && (
        <Button
          sx={{ textTransform: "none" }}
          fullWidth
          onClick={handleResendVerification}
          color="primary"
          variant="contained"
          size="large"
        >
          Gửi lại xác minh cho {email}
        </Button>
      )}
    </Box>
  );
};
