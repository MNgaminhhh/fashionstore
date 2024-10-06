import { StyledRoot } from "./styles";
import ColumnList from "./ColumnList";
import CategoryItem from "../categoryitem";
import Banner from "./Banner";
interface Props {
    data: CategoryItem[];
}

const MegaMenu2 = ({ data = [] }: Props) => {
    return (
        <StyledRoot elevation={2}>
            {data.map((item) => (
                <CategoryItem
                    href={item.href}
                    icon={item.icon}
                    key={item.title}
                    title={item.title}
                    caret={!!item.children}
                    render={
                        item.children?.length ? (
                            <ColumnList minWidth={550} list={item.children}>
                                <Banner />
                            </ColumnList>
                        ) : null
                    }
                />
            ))}
        </StyledRoot>
    );
};

export default MegaMenu2;

