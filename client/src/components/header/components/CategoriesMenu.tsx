import Button from "@mui/material/Button";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import {FlexBox} from "../../flexbox";
import {Category} from "@mui/icons-material";
import CategoryMenu from "../../categories";

export default function CategoriesMenu() {
    return (
        <CategoryMenu
            render={(handler) => (
                <FlexBox color="grey.600" alignItems="center" ml={2}>
                    <Button color="inherit" onClick={(e) => handler(e)}>
                        <Category fontSize="small" sx={{ color: "#fff" }} />
                        <KeyboardArrowDown fontSize="small" sx={{ color: "#fff" }} />
                    </Button>
                </FlexBox>
            )}
        />
    );
}
