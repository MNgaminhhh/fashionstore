"use client";
import { PropsWithChildren } from "react";
import { usePathname } from "next/navigation";
import { StyledWrapper } from "./styles";
import LogoTitle from "./components/LogoTitle";
import { FlexCenterRow } from "../../components/flexbox";
import LinkBox from "./components/LinkBox";
import LoginBottom from "./components/LoginBottom";
import {Banner} from "./components/Banner";
import banner1 from "../../assets/s_banner1.png";
export default function AuthLayout({ children }: PropsWithChildren) {
    const pathname = usePathname();
    const isLogin = pathname === "/login";
    const isRegister = pathname === "/register";
    const isResetPassword = pathname === "/reset-password";

    const CONTENT_BOTTOM = isLogin ? <LoginBottom /> : isRegister ? (
        <FlexCenterRow gap={1} mt={3}>
            Bạn đã có tài khoản?
            <LinkBox title="Đăng nhập ngay" href="/login" />
        </FlexCenterRow>
    ) : null;

    const WrapperContent = (
        <StyledWrapper elevation={3}>
            {!isResetPassword && <LogoTitle />}
            {children}
            {!isResetPassword && CONTENT_BOTTOM}
        </StyledWrapper>
    );

    return (
        <>
            <Banner
                title={isLogin ? "Đăng Nhập" : isRegister ? "Đăng Ký" : "Đặt Lại Mật Khẩu"}
                bannerImage={banner1.src}
                breadcrumb={[
                    { name: "Trang Chủ", href: "/" },
                    { name: isLogin ? "Đăng Nhập" : isRegister ? "Đăng Ký" : "Đặt Lại Mật Khẩu", href: pathname }
                ]}
            />
            <FlexCenterRow flexDirection="column" my={4} px={2}>
                {isResetPassword ? WrapperContent : <>{WrapperContent}</>}
            </FlexCenterRow>
        </>
    );
}
