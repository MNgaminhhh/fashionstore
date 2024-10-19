import {Fragment} from "react";
import {FlexBox, FlexCenterRow} from "../../../components/flexbox";
import LinkBox from "./LinkBox";

export default function LoginBottom() {
    return (
        <Fragment>
            <FlexCenterRow gap={1} my={3}>
                Bạn không có tài khoản?
                <LinkBox title="Đăng ký ngay" href="/register" />
            </FlexCenterRow>
            <FlexBox gap={1} py={2} borderRadius={1} justifyContent="center" bgcolor="grey.100">
                Bạn quên mật khẩu?
                <LinkBox title="Đặt lại mật khẩu" href="/forgot-password" />
            </FlexBox>
        </Fragment>
    );
}
