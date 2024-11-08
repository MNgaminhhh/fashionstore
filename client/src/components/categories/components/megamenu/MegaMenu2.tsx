import { StyledRoot } from "./styles";
import ColumnList from "./ColumnList";
import CategoryItem from "../categoryitem";
import Banner from "./Banner";
import ColumnList2 from "./ColumnList2";
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
              <ColumnList2 minWidth={200} list={item.children}></ColumnList2>
            ) : null
          }
        />
      ))}
    </StyledRoot>
  );
};

export default MegaMenu2;
