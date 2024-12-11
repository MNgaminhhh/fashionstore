import { useState, useEffect } from "react";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import { StyledWrapper, StyledCard, StyledContainer } from "./styles";
import { MenuList } from "./utils/types";
import ChildCategories from "./components/ChildCategories";
import { FlexCenterRow } from "../../../flexbox";
import Categories from "./components/Categories";

type Props = {
  menuList: MenuList[];
  title: string;
};

export default function CategoryMenu({ title, menuList = [] }: Props) {
  const [openList, setOpenList] = useState(
    menuList.length > 0 ? menuList[0].title : ""
  );
  const categories = menuList.reduce((prev, curr) => [...prev, curr.title], []);
  const subCategories = menuList.find((item) => item.title === openList);

  useEffect(() => {
    if (menuList.length > 0) {
      setOpenList(menuList[0].title);
    }
  }, [menuList]);

  return (
    <StyledWrapper>
      <FlexCenterRow fontWeight={600} alignItems="flex-end" gap={0.3}>
        {title}
        <KeyboardArrowDown sx={{ color: "grey.500", fontSize: "1.1rem" }} />
      </FlexCenterRow>

      <StyledContainer className="menu-list">
        <StyledCard>
          {menuList.length > 0 ? (
            <>
              <Categories
                openList={openList}
                categories={categories}
                handleOpen={(item) => setOpenList(item)}
              />
              <ChildCategories categories={subCategories} />
            </>
          ) : (
            <div>No Categories Available</div>
          )}
        </StyledCard>
      </StyledContainer>
    </StyledWrapper>
  );
}
