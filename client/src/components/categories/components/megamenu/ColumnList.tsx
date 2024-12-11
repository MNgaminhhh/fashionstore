import { PropsWithChildren } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { StyledRoot } from "./styles";
import { CategoryItem, CategoryItemOffer } from "../../utils/types";
import { NavLink } from "../../../navlink";
import { FlexBox } from "../../../flexbox";

interface Props extends PropsWithChildren {
  minWidth?: number;
  list: CategoryItem[];
  banner?: CategoryItemOffer;
}

export default function ColumnList({
  list = [],
  children,
  minWidth = 760,
}: Props) {
  return (
    <StyledRoot elevation={2} sx={{ minWidth }}>
      <FlexBox px={2.5}>
        <Box flex="1 1 0">
          <Grid container spacing={4}>
            {list.map((item, ind) => (
              <Grid item md={3} key={ind}>
                <div className="title-link">{item.title}</div>

                {item.children?.map((sub, ind) => (
                  <NavLink className="child-link" href={sub.href} key={ind}>
                    {sub.title}
                  </NavLink>
                ))}
              </Grid>
            ))}
          </Grid>
        </Box>
      </FlexBox>

      {children}
    </StyledRoot>
  );
}
