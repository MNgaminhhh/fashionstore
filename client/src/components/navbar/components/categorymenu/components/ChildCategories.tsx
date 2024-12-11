import Box from "@mui/material/Box";
import { StyledSubCategoryList } from "../styles";
import ItemCategory from "./ItemCategory";
import {MenuList} from "../utils/types";
import {H6} from "../../../../Typography";
import Scrollbar from "../../../../scrollbar";

type Props = { categories: MenuList };
export default function ChildCategories({ categories }: Props) {
    return (
        <Scrollbar autoHide={false} sx={{ width: "100%" }}>
            <Box px={6} py={2} height="100%">
                {categories.child.map((item, key) => (
                    <div key={key}>
                        <H6 fontWeight={700} my={3}>
                            {item.title}
                        </H6>
                        <StyledSubCategoryList>
                            {item.child.map((sub, key) => (
                                <ItemCategory item={sub} key={key} />
                            ))}
                        </StyledSubCategoryList>
                    </div>
                ))}
            </Box>
        </Scrollbar>
    );
}
