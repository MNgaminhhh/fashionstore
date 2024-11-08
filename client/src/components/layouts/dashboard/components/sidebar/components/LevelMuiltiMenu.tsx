import { usePathname, useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import { navigation, navigationAdmin } from "../data";
import {
  ListLabel,
  BadgeValue,
  StyledText,
  BulletIcon,
  ExternalLink,
  NavItemButton,
  ListIconWrapper,
} from "../styles";
import { useLayout } from "../../../context/LayoutContext";
import Scrollbar from "../../../../../scrollbar";
import Accordion from "./Accordion";

type LevelMuiltiMenuProps = {
  role: string | null;
};
export default function LevelMuiltiMenu({ role }: LevelMuiltiMenuProps) {
  const router = useRouter();
  const pathname = usePathname();

  const { isCompact, topNavbarHeight } = useLayout();

  const activeRoute = (path: string) => pathname === path;

  const handleNavigation = (path: string) => {
    router.push(path);
  };
  const menuData = role === "admin" ? navigationAdmin : navigation;
  const renderLevels = (data: any) => {
    return data.map((item: any, index: number) => {
      if (item.type === "label") {
        return (
          <ListLabel key={index} compact={isCompact}>
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
          <ExternalLink
            key={index}
            href={item.path}
            rel="noopener noreferrer"
            target="_blank"
          >
            <NavItemButton active={false}>
              {item.icon ? (
                <ListIconWrapper>
                  <item.icon />
                </ListIconWrapper>
              ) : (
                <span className="item-icon icon-text">{item.iconText}</span>
              )}

              <StyledText compact={isCompact}>{item.name}</StyledText>

              {item.badge && (
                <BadgeValue compact={isCompact}>{item.badge.value}</BadgeValue>
              )}
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

          <StyledText compact={isCompact}>{item.name}</StyledText>

          {item.badge && (
            <BadgeValue compact={isCompact}>{item.badge.value}</BadgeValue>
          )}
        </NavItemButton>
      );
    });
  };

  return (
    <Scrollbar
      autoHide
      clickOnTrack={false}
      sx={{
        overflowX: "hidden",
        maxHeight: `calc(100vh - ${topNavbarHeight}px)`,
      }}
    >
      <Box height="100%" px={2}>
        {renderLevels(menuData)}
      </Box>
    </Scrollbar>
  );
}
