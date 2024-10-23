import Link from "next/link";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import useMediaQuery from "@mui/material/useMediaQuery";
import { SvgIconComponent, Menu } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { Theme } from "@mui/material/styles";
import { H2 } from "../../../components/Typography";
import { StyledBox } from "../styles";
import {Navigation} from "../../../components/layouts/customer";
import {FlexBox} from "../../../components/flexbox";
import SideNav from "../../../components/sidenav";


type WithButton = {
    href: string;
    title: string;
    buttonText: string;
    Icon: SvgIconComponent;
};

type WithoutButton = {
    title: string;
    href?: never;
    buttonText?: never;
    Icon: SvgIconComponent;
};

type Props = WithoutButton | WithButton;

export default function Header({ title, buttonText, href, Icon }: Props) {
    const isTablet = useMediaQuery("(max-width: 1025px)");

    const HEADER_LINK = buttonText && href && (
        <Button
            component={Link}
            href={href}
            color="primary"
            sx={{ bgcolor: "gray.800", px: 4 }}
        >
            {buttonText}
        </Button>
    );

    return (
        <StyledBox>
            <FlexBox mt={2} className="headerHold">
                <FlexBox alignItems="center" gap={1.5}>
                    {Icon && <Icon color="primary" />}
                    <H2 my={0} lineHeight={1} ellipsis>
                        {title}
                    </H2>
                </FlexBox>

                <div className="sidenav">
                    <SideNav
                        position="left"
                        handler={(close) => (
                            <IconButton onClick={close}>
                                <Menu fontSize="small" />
                            </IconButton>
                        )}
                    >
                        <Navigation />
                    </SideNav>
                </div>

                {!isTablet && HEADER_LINK}
            </FlexBox>

            {isTablet && <Box mt={2}>{HEADER_LINK}</Box>}
        </StyledBox>
    );
}
