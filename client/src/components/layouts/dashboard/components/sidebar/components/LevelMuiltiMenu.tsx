import { usePathname, useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import { navigation } from "../data";
import {
    ListLabel,
    BadgeValue,
    StyledText,
    BulletIcon,
    ExternalLink,
    NavItemButton,
    ListIconWrapper
} from "../styles";
import {useLayout} from "../../../context/LayoutContext";
import Scrollbar from "../../../../../scrollbar";
import Accordion from "./Accordion";

export default function LevelMuiltiMenu() {
    const router = useRouter();
    const pathname = usePathname();

    const { COMPACT, TOP_HEADER_AREA } = useLayout();

    const activeRoute = (path: string) => pathname === path;

    const handleNavigation = (path: string) => {
        router.push(path);
    };

    const renderLevels = (data: any) => {
        return data.map((item: any, index: number) => {
            if (item.type === "label") {
                return (
                    <ListLabel key={index} compact={COMPACT}>
                        {item.label}
                    </ListLabel>
                );
            }

            if (item.children) {
                return (
                    <Accordion key={index} item={item}>
                        {renderLevels(item.children)}
                    </Accordion>
                );
            }

            if (item.type === "extLink") {
                return (
                    <ExternalLink key={index} href={item.path} rel="noopener noreferrer" target="_blank">
                        <NavItemButton active={false}>
                            {item.icon ? (
                                <ListIconWrapper>
                                    <item.icon />
                                </ListIconWrapper>
                            ) : (
                                <span className="item-icon icon-text">{item.iconText}</span>
                            )}

                            <StyledText compact={COMPACT}>{item.name}</StyledText>

                            {item.badge && <BadgeValue compact={COMPACT}>{item.badge.value}</BadgeValue>}
                        </NavItemButton>
                    </ExternalLink>
                );
            }

            return (
                <NavItemButton
                    key={index}
                    className="navItem"
                    active={activeRoute(item.path)}
                    onClick={() => handleNavigation(item.path)}
                >
                    {item.icon ? (
                        <ListIconWrapper>
                            <item.icon />
                        </ListIconWrapper>
                    ) : (
                        <BulletIcon active={activeRoute(item.path)} />
                    )}

                    <StyledText compact={COMPACT}>{item.name}</StyledText>

                    {item.badge && <BadgeValue compact={COMPACT}>{item.badge.value}</BadgeValue>}
                </NavItemButton>
            );
        });
    };

    return (
        <Scrollbar
            autoHide
            clickOnTrack={false}
            sx={{ overflowX: "hidden", maxHeight: `calc(100vh - ${TOP_HEADER_AREA}px)` }}
        >
            <Box height="100%" px={2}>
                {renderLevels(navigation)}
            </Box>
        </Scrollbar>
    );
}
