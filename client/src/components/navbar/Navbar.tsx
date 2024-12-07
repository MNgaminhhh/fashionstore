import { NavBarWrapper, InnerContainer } from "./styles";
import Categories from "./components/Categories";
import NavigationList from "./components/navlist/NavList";
import { FlexBox } from "../flexbox";
import LoginRegisterButton from "./components/loginregisterbutton/LoginRegisterButton";
import { useAppContext } from "../../context/AppContext";
import Profile from "../profile/Profile";
interface Props {
  border?: number;
  elevation?: number;
  hideCategories?: boolean;
}

export default function Navbar({
  border,
  elevation = 2,
  hideCategories = false,
}: Props) {
  const { sessionToken } = useAppContext();
  return (
    <NavBarWrapper elevation={elevation} border={border}>
      {hideCategories ? (
        <InnerContainer sx={{ justifyContent: "center" }}>
          <NavigationList />
          <Profile />
        </InnerContainer>
      ) : (
        <InnerContainer>
          <FlexBox gap={3}>
            <Categories />
            <NavigationList />
          </FlexBox>
          {!sessionToken ? <LoginRegisterButton /> : <Profile />}
        </InnerContainer>
      )}
    </NavBarWrapper>
  );
}
