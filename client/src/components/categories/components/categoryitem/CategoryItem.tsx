import Link from "next/link";
import { ReactNode } from "react";
import {ChevronLeft, SvgIconComponent} from "@mui/icons-material";
import { StyledWrapper } from "./styles";

interface CategoryItemProps {
    href: string;
    title: string;
    caret?: boolean;
    render?: ReactNode;
    icon?: SvgIconComponent;
}

export default function CategoryItem(props: CategoryItemProps) {
    const { href, title, render, caret = true, icon: Icon } = props;

    return (
        <StyledWrapper>
            <Link href={href}>
                <div className="category-dropdown-link">
                    {Icon ? <Icon fontSize="small" color="inherit" /> : null}
                    <span className="title">{title}</span>
                    {caret ? <ChevronLeft fontSize="small" className="caret-icon" /> : null}
                </div>
            </Link>

            {render ? <div className="mega-menu">{render}</div> : null}
        </StyledWrapper>
    );
}
