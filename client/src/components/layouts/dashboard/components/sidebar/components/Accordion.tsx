import { PropsWithChildren, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import styled from "@mui/material/styles/styled";
import {
  BadgeValue,
  BulletIcon,
  StyledText,
  NavItemButton,
  ListIconWrapper,
  ChevronRightIcon,
} from "../styles";
import { useLayout } from "../../../context/LayoutContext";

const NavExpandRoot = styled("div")({
  "& .expansion-panel": {
    overflow: "hidden",
    "& .expansion-panel": { paddingLeft: 8 },
  },
});
interface Props extends PropsWithChildren {
  item: any;
}

export default function Accordion({ item, children }: Props) {
  const { name, icon, iconText, badge } = item || {};
  const { isCompact } = useLayout();
  const pathname = usePathname();

  const [hasActive, setHasActive] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const handleClick = () => setCollapsed((prev) => !prev);

  const isActive = !!item?.children?.find((li: any) => li.path === pathname);

  useEffect(() => {
    if (isActive) {
      setCollapsed(true);
      setHasActive(true);
    } else {
      setHasActive(false);
    }
    if (isCompact) {
      setCollapsed(false);
    }

    return () => {
      setCollapsed(false);
      setHasActive(false);
    };
  }, [isActive, isCompact]);

  return (
    <NavExpandRoot className="subMenu">
      <NavItemButton
        active={hasActive}
        onClick={handleClick}
        sx={{ justifyContent: "space-between" }}
      >
        <Box display="flex" alignItems="center">
          {icon && (
            <ListIconWrapper>
              <item.icon />
            </ListIconWrapper>
          )}

          {iconText && <BulletIcon active={hasActive} />}

          <StyledText compact={isCompact}>{name}</StyledText>
        </Box>

        {badge && <BadgeValue compact={isCompact}>{badge.value}</BadgeValue>}

        <ChevronRightIcon
          color="disabled"
          compact={isCompact}
          collapsed={collapsed}
        />
      </NavItemButton>

      <Collapse in={collapsed} unmountOnExit>
        <div className="expansion-panel">{children}</div>
      </Collapse>
    </NavExpandRoot>
  );
}
