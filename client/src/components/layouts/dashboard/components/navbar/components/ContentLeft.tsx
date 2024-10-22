import Link from "next/link";
import { Fragment } from "react";
import PublicIcon from "@mui/icons-material/Public";
import MenuIcon from "@mui/icons-material/Menu";
import { CustomButton, ToggleWrapper } from "../styles";
import { useLayout } from "../../../context/LayoutContext";

export default function ContentLeft() {
    return (
        <>
            <ToggleWrapper>
                <MenuIcon />
            </ToggleWrapper>
            <CustomButton
                component={Link}
                href="/"
                startIcon={<PublicIcon sx={{ color: "grey.900" }} />}
            >
                Trang Chủ
            </CustomButton>
        </>
    );
}
