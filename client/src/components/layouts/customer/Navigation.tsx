"use client";

import { usePathname } from "next/navigation";
import { Fragment } from "react";
import { Paragraph, Span } from "../../Typography";
import { StyledMainContainer, StyledNavLink } from "./styles";
import {FlexBox} from "../../flexbox";
import {MENUS} from "./data";

export default function Navigation() {
    const pathname = usePathname();

    return (
        <StyledMainContainer>
            {MENUS.map((item) => (
                <Fragment key={item.title}>
                    <Paragraph p="26px 30px 2rem" color="grey.700" fontSize={12}>
                        {item.title}
                    </Paragraph>
                    {item.list?.map(({ Icon, count, href, title }) => (
                        <StyledNavLink href={href} key={title} isCurrentPath={pathname === href}>
                            <FlexBox alignItems="center" gap={1}>
                                <Icon color="inherit" fontSize="small" className="nav-icon" />
                                <Span>{title}</Span>
                            </FlexBox>

                            {count > 0 && <Span>{count}</Span>}
                        </StyledNavLink>
                    ))}
                </Fragment>
            ))}
        </StyledMainContainer>
    );
}
