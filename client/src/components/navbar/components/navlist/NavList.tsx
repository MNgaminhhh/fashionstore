import MenuItem from "@mui/material/MenuItem";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import navigation from "./data";
import {
  StyledNavLink,
  NAV_LINK_STYLES,
  ChildNavListWrapper,
} from "../../styles";
import { NavList } from "../../utils/types";
import { FlexBox } from "../../../flexbox";
import { MTCard } from "../../../MTCard";
import { NavLink } from "../../../navlink";
import NavItem from "./NavItem";
import MegaMenu from "../megamenu/MegaMenu";
import CategoryMenu from "../categorymenu";
import { useAppContext } from "../../../../context/AppContext";

export default function NavigationList() {
  const { role } = useAppContext();

  const renderNestedNav = (list: any = [], isRoot = false) => {
    const filteredList = list.filter((nav) => {
      if (!nav.allowedRoles) return false;
      return nav.allowedRoles.includes(role);
    });

    return filteredList.map((nav: NavList) => {
      if (isRoot) {
        if (nav.megaMenu) {
          return (
            <MegaMenu key={nav.title} title={nav.title} menuList={nav.child} />
          );
        }
        if (nav.megaMenuWithSub) {
          return (
            <CategoryMenu
              key={nav.title}
              title={nav.title}
              menuList={nav.child}
            />
          );
        }
        if (nav.url) {
          return (
            <StyledNavLink href={nav.url} key={nav.title}>
              {nav.title}
            </StyledNavLink>
          );
        }
        if (!nav.megaMenu && !nav.megaMenuWithSub && !nav.child) {
          return (
            <FlexBox
              key={nav.title}
              alignItems="center"
              position="relative"
              flexDirection="column"
              sx={{
                cursor: "pointer",
                "&:hover": {
                  color: "primary.main",
                },
              }}
            >
              {nav.url ? (
                <StyledNavLink href={nav.url}>{nav.title}</StyledNavLink>
              ) : (
                nav.title
              )}
            </FlexBox>
          );
        }

        if (nav.child) {
          return (
            <FlexBox
              key={nav.title}
              alignItems="center"
              position="relative"
              flexDirection="column"
              justifyItems="center"
              sx={{
                "&:hover": { "& > .child-nav-item": { display: "block" } },
              }}
            >
              <FlexBox alignItems="flex-end" gap={0.3} sx={NAV_LINK_STYLES}>
                {nav.title}{" "}
                <KeyboardArrowDown
                  sx={{
                    color: "grey.500",
                    fontSize: "1.1rem",
                  }}
                />
              </FlexBox>

              <ChildNavListWrapper className="child-nav-item">
                <MTCard elevation={3} sx={{ mt: 2.5, py: 1, minWidth: 100 }}>
                  {renderNestedNav(nav.child, false)}
                </MTCard>
              </ChildNavListWrapper>
            </FlexBox>
          );
        }
      } else {
        if (nav.url) {
          return (
            <NavLink href={nav.url} key={nav.title}>
              <MenuItem sx={{ fontSize: "14px" }}>{nav.title}</MenuItem>
            </NavLink>
          );
        }

        if (nav.child) {
          return (
            <NavItem nav={nav} key={nav.title}>
              {renderNestedNav(nav.child, false)}
            </NavItem>
          );
        }
      }
    });
  };

  return <FlexBox gap={3}>{renderNestedNav(navigation, true)}</FlexBox>;
}
