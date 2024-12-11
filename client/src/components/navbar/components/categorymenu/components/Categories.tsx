import ChevronRight from "@mui/icons-material/ChevronRight";
import {StyledCategory, StyledCategoryList} from "../styles";

interface Props {
    categories: string[];
    openList: string;
    handleOpen: (item: string) => void;
}

export default function Categories({ categories, openList, handleOpen }: Props) {
    return (
        <StyledCategoryList>
            {categories.map((item) => (
                <StyledCategory
                    key={item}
                    active={openList === item ? 1 : 0}
                    onMouseEnter={() => handleOpen(item)}
                >
                    {item}

                    <ChevronRight
                        fontSize="small"
                    />
                </StyledCategory>
            ))}
        </StyledCategoryList>
    );
}
