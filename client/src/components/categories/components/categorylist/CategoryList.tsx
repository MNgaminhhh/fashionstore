import { StyledRoot } from "./styles";
import { CategoryListProps } from "./utils/types";
import CategoryItem from "../categoryitem";
import MegaMenu1 from "../megamenu/MegaMenu1";
import MegaMenu2 from "../megamenu/MegaMenu2";
import { useAppContext } from "../../../../context/AppContext";

export default function CategoryList({
  open,
  position = "absolute",
}: CategoryListProps) {
  const { categories } = useAppContext();
  const megaMenuComponents: { [key: string]: React.FC<any> } = {
    ["MegaMenu1.name"]: MegaMenu1,
    ["MegaMenu2.name"]: MegaMenu2,
  };
  return (
    <StyledRoot open={open} position={position}>
      {categories.map((item) => {
        const { href, title, children, component, icon, offer } = item;
        const MegaMenu = component ? megaMenuComponents[component] : null;

        return (
          <CategoryItem
            key={title}
            href={href}
            icon={icon}
            title={title}
            caret={!!children}
            render={
              MegaMenu && children && children.length > 0 ? (
                <MegaMenu data={children} banner={offer} />
              ) : (
                <></>
              )
            }
          />
        );
      })}
    </StyledRoot>
  );
}
