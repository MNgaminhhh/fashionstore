import {StyledButton} from "./styles";
import {FlexBox} from "../../../flexbox";

export default function LoginRegisterButton() {
    return (
        <FlexBox gap={1} sx={{ ml: "auto" }}>
            <StyledButton variant="outlined" href="/login" variantType="login">
                Đăng Nhập
            </StyledButton>
            <StyledButton variant="contained" href="/register" variantType="register">
                Đăng Ký
            </StyledButton>
        </FlexBox>
    );
}
