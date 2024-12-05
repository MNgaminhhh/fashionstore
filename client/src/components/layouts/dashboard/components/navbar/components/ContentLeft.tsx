import Link from "next/link";
import PublicIcon from "@mui/icons-material/Public";
import MenuIcon from "@mui/icons-material/Menu";
import { CustomButton, ToggleWrapper } from "../styles";

export default function ContentLeft() {
  return (
    <>
      <ToggleWrapper>
        <MenuIcon />
      </ToggleWrapper>
      <CustomButton
        component={Link}
        href="/"
        startIcon={<PublicIcon sx={{ color: "white" }} />}
      >
        Trang Chủ
      </CustomButton>
    </>
  );
}
