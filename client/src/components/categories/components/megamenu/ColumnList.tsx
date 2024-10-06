import { PropsWithChildren } from "react";
import Link from "next/link";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { StyledRoot } from "./styles";
import { CategoryItem, CategoryItemOffer } from "../../utils/types";
import BaseImage from "../../../BaseImage";
import {NavLink} from "../../../navlink";
import {FlexBox} from "../../../flexbox";

interface Props extends PropsWithChildren {
    minWidth?: number;
    list: CategoryItem[];
    banner?: CategoryItemOffer;
}

export default function ColumnList({ list = [], children, banner, minWidth = 760 }: Props) {
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

                {banner?.position === "right" ? (
                    <Box mt={1.5}>
                        <Link href={banner.href}>
                            <BaseImage src={banner.url} width={137} height={318} alt="banner" />
                        </Link>
                    </Box>
                ) : null}
            </FlexBox>

            {children}
        </StyledRoot>
    );
}
