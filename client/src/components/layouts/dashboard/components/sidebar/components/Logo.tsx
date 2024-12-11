import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import { ChevronLeftIcon } from "../styles";
import { useLayout } from "../../../context/LayoutContext";

export default function Logo() {
  const { topNavbarHeight, isCompact, isSidebarCompact, toggleSidebarCompact } =
    useLayout();
  const logoSrc = "/assets/images/logo.svg";
  const logoSrc2 = "/assets/images/logo-compact.svg";

  return (
    <Card
      sx={{
        backgroundColor: "black",
        p: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: isCompact ? "center" : "space-between",
        width: "100%",
        borderRadius: 0,
      }}
    >
      <Avatar
        alt="MTshop Logo"
        src={isCompact ? logoSrc2 : logoSrc}
        sx={{
          width: "auto",
          borderRadius: 0,
          marginLeft: isCompact ? 0 : 1,
        }}
      />

      {!isCompact && (
        <ChevronLeftIcon
          color="disabled"
          compact={!!isCompact}
          onClick={toggleSidebarCompact}
          sidebarCompact={!!isSidebarCompact}
        />
      )}
    </Card>
  );
}
