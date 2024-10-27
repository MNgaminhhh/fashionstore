import { PropsWithChildren } from "react";
import { usePathname } from "next/navigation";
import MenuItem from "@mui/material/MenuItem";
import ArrowRight from "@mui/icons-material/ArrowRight";
import { ParentNav, ParentNavItem } from "../../styles";
import { NavList } from "../../utils/types";
import { MTCard } from "../../../MTCard";
import { Span } from "../../../Typography";
import useEleOverflow from "../../../../hooks/useEleOverflow";
interface NavItemChildProps extends PropsWithChildren {
  nav: NavList;
}
export default function NavItem({ nav, children }: NavItemChildProps) {
  const pathname = usePathname();
  const { checkOverflow, elementRef, isLeftOverflowing, isRightOverflowing } =
    useEleOverflow();

  const isActive = nav.child.flat().find((item) => item.url === pathname);

  return (
    <ParentNav
      minWidth={200}
      active={isActive ? 1 : 0}
      onMouseEnter={checkOverflow}
    >
      <MenuItem color="grey.700">
        <Span flex="1 1 0">{nav.title}</Span>
        <ArrowRight fontSize="small" />
      </MenuItem>

      <ParentNavItem
        ref={elementRef}
        left={isLeftOverflowing}
        right={isRightOverflowing}
        className="parent-nav-item"
      >
        <MTCard elevation={3} sx={{ py: "0.5rem", minWidth: 180 }}>
          {children}
        </MTCard>
      </ParentNavItem>
    </ParentNav>
  );
}
