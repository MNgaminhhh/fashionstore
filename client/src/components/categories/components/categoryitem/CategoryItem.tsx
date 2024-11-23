import Link from "next/link";
import { ReactNode } from "react";
import { ChevronLeft } from "@mui/icons-material";
import { StyledWrapper } from "./styles";
import { IconType } from "react-icons";
import * as Icons from "react-icons/fa";

interface CategoryItemProps {
  href: string;
  title: string;
  caret?: boolean;
  render?: ReactNode;
  icon?: string;
}

export default function CategoryItem(props: CategoryItemProps) {
  const { href, title, render, caret = true, icon } = props;
  const IconComponent: IconType | null = icon
    ? Icons[icon as keyof typeof Icons]
    : null;

  return (
    <StyledWrapper>
      <Link href={href}>
        <div className="category-dropdown-link">
          {IconComponent ? <IconComponent size="1em" color="inherit" /> : null}
          <span className="title">{title}</span>
          {caret ? (
            <ChevronLeft fontSize="small" className="caret-icon" />
          ) : null}
        </div>
      </Link>

      {render ? <div className="mega-menu">{render}</div> : null}
    </StyledWrapper>
  );
}
