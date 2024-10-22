import Avatar from "@mui/material/Avatar";
import {FlexBetween} from "../../../../../flexbox";
import {ChevronLeftIcon} from "../styles";
import {useLayout} from "../../../context/LayoutContext";

export default function Logo() {
    const {
        TOP_HEADER_AREA,
        isCompact,
        isSidebarCompact,
        toggleSidebarCompact
    } = useLayout();
    const logoSrc = "/assets/images/logo.svg";

    return (
        <FlexBetween
            p={2}
            maxHeight={TOP_HEADER_AREA}
            justifyContent={isCompact ? "center" : "space-between"}
        >
            <Avatar
                alt="MTshop Logo"
                src={logoSrc}
                sx={{ borderRadius: 0, width: "auto", marginLeft: isCompact ? 0 : 1 }}
            />

            {!isCompact && (
                <ChevronLeftIcon
                    color="disabled"
                    compact={!!isCompact}
                    onClick={toggleSidebarCompact}
                    sidebarCompact={!!isSidebarCompact}
                />
            )}
        </FlexBetween>
    );
}
