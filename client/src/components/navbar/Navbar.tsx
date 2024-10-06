import { NavBarWrapper, InnerContainer } from "./styles";
import Categories from "./components/categories";
import NavigationList from "./components/navlist/NavList";
import {FlexBox} from "../flexbox";
import LoginRegisterButton from "./components/loginregisterbutton/LoginRegisterButton";

interface Props {
    border?: number;
    elevation?: number;
    hideCategories?: boolean;
}
export default function Navbar({ border, elevation = 2, hideCategories = false }: Props) {
    return (
        <NavBarWrapper elevation={elevation} border={border}>
            {hideCategories ? (
                <InnerContainer sx={{ justifyContent: "center" }}>
                    <NavigationList />
                </InnerContainer>
            ) : (
                <InnerContainer>
                    <FlexBox gap={3}>
                        <Categories />
                        <NavigationList />
                    </FlexBox>
                    <LoginRegisterButton />
                </InnerContainer>
            )}
        </NavBarWrapper>
    );
}
