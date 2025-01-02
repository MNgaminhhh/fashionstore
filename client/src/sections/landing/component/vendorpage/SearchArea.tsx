import { useState } from "react";
import { FlexBox } from "../../../../components/flexbox";
import SearchInput from "./styles";
interface Props {
  handleSearch: (search: string) => void;
  searchPlaceholder: string;
}

export default function SearchArea({
  searchPlaceholder = "Tìm kiếm...",
  handleSearch,
}: Props) {
  const [search, setSearch] = useState("");

  return (
    <FlexBox mb={2} gap={2} justifyContent="space-between" flexWrap="wrap">
      <SearchInput
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        label="Tìm kiếm tên cửa hàng"
        size="small"
        sx={{ minWidth: 300 }}
        placeholder={searchPlaceholder}
        onKeyUp={(e) => {
          if (e.key === "Enter") {
            handleSearch(search);
          }
        }}
      />
    </FlexBox>
  );
}
