
import { categoryMenus } from "./data";
import { StyledRoot } from "./styles";
import {CategoryListProps} from "./utils/types";
import CategoryItem from "../categoryitem";
import MegaMenu1 from "../megamenu/MegaMenu1";
import MegaMenu2 from "../megamenu/MegaMenu2";

export default function CategoryList({ open, position = "absolute" }: CategoryListProps) {
    return (
        <StyledRoot open={open} position={position}>
            {categoryMenus.map((item) => {
                const { href, title, children, component, icon, offer } = item;
                const MegaMenu = component === MegaMenu1.name ? MegaMenu1 : MegaMenu2;

                return (
                    <CategoryItem
                        key={title}
                        href={href}
                        icon={icon}
                        title={title}
                        caret={!!children}
                        render={component ? <MegaMenu data={children} banner={offer} /> : null}
                    />
                );
            })}
        </StyledRoot>
    );
}
