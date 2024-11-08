import { PropsWithChildren } from "react";
import Box from "@mui/material/Box";
import ChevronRight from "@mui/icons-material/ChevronRight";
import { StyledRoot } from "./styles";
import { CategoryItem, CategoryItemOffer } from "../../utils/types";
import { NavLink } from "../../../navlink";
import { FlexBox } from "../../../flexbox";

interface Props extends PropsWithChildren {
  minWidth?: number;
  list: CategoryItem[];
  banner?: CategoryItemOffer;
}

export default function ColumnList2({
  list = [],
  children,
  banner,
  minWidth = 760,
}: Props) {
  return (
    <StyledRoot elevation={2} sx={{ minWidth }}>
      <FlexBox px={2.5} flexDirection="column">
        <Box flex="1 1 0">
          {list.map((item, ind) => (
            <NavLink
              className="child-link"
              href={item.href}
              key={ind}
              sx={{
                display: "flex",
                alignItems: "left",
                padding: "0.5rem 1rem",
              }}
            >
              <span style={{ flexGrow: 1 }}>{item.title}</span>
            </NavLink>
          ))}
        </Box>
      </FlexBox>

      {children}
    </StyledRoot>
  );
}
