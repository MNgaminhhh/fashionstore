import Link from "next/link";
import { Fragment, ReactNode } from "react";
import useTheme from "@mui/material/styles/useTheme";
import useMediaQuery from "@mui/material/useMediaQuery";
import clsx from "clsx";
import { HeaderWrapper, StyledContainer } from "./styles";
import {FlexBox} from "../flexbox";
import BaseImage from "../BaseImage";
import useHeader from "./hooks/useHeader";
import CategoriesMenu from "./components/CategoriesMenu";
import logo from "../../assets/mtshop.png";
import NotificationButtons from "./components/CartShuffleButton";
import Logo from "../logo/Logo";
interface Props {
    isFixed?: boolean;
    className?: string;
    midSlot: ReactNode;
}

export default function Header({ isFixed, className, midSlot }: Props) {
    const theme = useTheme();
    const screenMD = useMediaQuery(theme.breakpoints.down(1150));

    return (
        <HeaderWrapper className={clsx(className)}>
            <StyledContainer>{screenMD
                ? (<>
                    <Fragment>
                        <FlexBox minWidth={100} alignItems="center">
                            <Logo />
                            {isFixed ? <CategoriesMenu /> : null}
                        </FlexBox>
                        {midSlot}
                        <NotificationButtons/>
                    </Fragment>
                </>)
                : (<>
                    <Fragment>
                        <FlexBox minWidth={100} alignItems="center">
                            <Logo />
                            {isFixed ? <CategoriesMenu /> : null}
                        </FlexBox>
                        {midSlot}
                        <NotificationButtons/>
                    </Fragment>
                    </>
                )}
            </StyledContainer>
        </HeaderWrapper>
    );
}
