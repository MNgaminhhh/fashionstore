import { FlexCenterRow } from "../../../components/flexbox";
import { H3 } from "../../../components/Typography";
import logo from "../../../../public/assets/images/logo.svg";
import MTImage from "../../../components/MTImage";

export default function LogoTitle() {
    return (
        <FlexCenterRow
            flexDirection="column"
            gap={1.5}
            mb={4}
            sx={{
                backgroundColor: "#000000",
                padding: 3,
                borderRadius: 3,
                color: "#fff",
            }}
        >
            <MTImage src={logo} alt="mtshop" width={230} height={50} />
            <H3 fontWeight={700}>Chào Mừng, Đã Đến MTSHOP</H3>
        </FlexCenterRow>
    );
}
