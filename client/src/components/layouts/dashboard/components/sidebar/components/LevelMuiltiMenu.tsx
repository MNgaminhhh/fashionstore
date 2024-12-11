// LevelMuiltiMenu.tsx

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
  ListIconWrapper,
} from "../styles";
import { useLayout } from "../../../context/LayoutContext";
import Scrollbar from "../../../../../scrollbar";
import Accordion from "./Accordion";
import { useAppContext } from "../../../../../../context/AppContext";

export default function LevelMuiltiMenu() {
  const router = useRouter();
  const pathname = usePathname();
  const { role } = useAppContext();
  const { isCompact, topNavbarHeight } = useLayout();

  const activeRoute = (path: string) => pathname === path;

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const menuData: any[] = navigation;

  const hasAccess = (item: any): boolean => {
    if (!item.allowedRoles || item.allowedRoles.length === 0) return false;
    return item.allowedRoles.includes(role);
  };

  const renderLevels = (data: any[], isRoot = false) => {
    return data.map((item, index) => {
      if (!hasAccess(item)) {
        return null;
      }

      if (item.type === "label") {
        return (
          <ListLabel key={index} compact={isCompact}>
            {item.label}
          </ListLabel>
        );
      }

      if (item.children && item.children.length > 0) {
        const accessibleChildren = item.children.filter(hasAccess);

        if (accessibleChildren.length === 0) {
          return null;
        }

        return (
          <Accordion key={index} item={item}>
            {renderLevels(accessibleChildren)}
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
