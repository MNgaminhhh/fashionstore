import List from "@mui/material/List";
import { NavChild } from "../utils/types";
import { StyledListItem, StyledNavLink } from "../styles";
import { H6 } from "../../../../Typography";

type CategoryListProps = { category: NavChild };

export default function CategoryList({ category }: CategoryListProps) {
    const { title, child } = category || {};

    return (
        <List>
            <H6 mb={0.5} pl={4}>
                {title}
            </H6>

            {Array.isArray(child) && child.length > 0 ? (
                child.map((sub, i) => (
                    <StyledNavLink href={sub.url} key={sub.title + i}>
                        <StyledListItem>{sub.title}</StyledListItem>
                    </StyledNavLink>
                ))
            ) : (
                <StyledListItem>Không có danh mục con</StyledListItem>
            )}
        </List>
    );
}
