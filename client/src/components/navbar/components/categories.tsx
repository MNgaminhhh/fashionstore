import { CategoryMenuButton } from "../styles";
import {Paragraph} from "../../Typography";
import {ChevronRight} from "@mui/icons-material";
import CategoryMenu from "../../categories";
import MenuIcon from '@mui/icons-material/Menu';
export default function Categories() {
    return (
        <CategoryMenu
            render={(handler) => (
                <CategoryMenuButton variant="text" onClick={(e) => handler(e)}>
                    <div className="prefix">
                        <MenuIcon fontSize="small" />
                        <Paragraph fontWeight={600}>Danh Mục</Paragraph>
                    </div>

                    <ChevronRight className="dropdown-icon" fontSize="small" />
                </CategoryMenuButton>
            )}
        />
    );
}
