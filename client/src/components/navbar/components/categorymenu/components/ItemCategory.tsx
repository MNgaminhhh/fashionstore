import Link from "next/link";
import Avatar from "@mui/material/Avatar";
import {StyledSubCategoryList} from "../styles";
import {NavLink} from "../utils/types";

type CategoryItemProps = { item: NavLink }
export default function ItemCategory({ item }: CategoryItemProps) {
    const {
        title,
        url = "/",
        Icon,
        img
    } = item || {};

    return (
        <Link href={url} passHref>
            <StyledSubCategoryList>
                {img && (
                    <Avatar
                        alt={title}
                        src={img}
                        sx={{
                            backgroundColor: "grey.100",
                            borderRadius: 1
                        }}
                    />
                )}
                {Icon && <Icon sx={{ fontSize: 16 }} />}
                {title}
            </StyledSubCategoryList>
        </Link>
    );
}
