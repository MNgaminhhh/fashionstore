"use client";

import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import Container from "@mui/material/Container";
import { StyledCard, StyledListItem } from "./styles";
import { H3 } from "../../../../components/Typography";
import NavLink3 from "../../../../components/navlink/NavLink3";
import SliderShow from "../../../../components/slider/SliderShow";
import CardProduct2 from "../../../../components/card/productcard1/CardProduct2";

type Props = { data: any };

export default function CategoryProductView({ data }: Props) {
  console.log(data);
  if (!data) return null;
  const responsive = [
    { breakpoint: 1200, settings: { slidesToShow: 3 } },
    { breakpoint: 650, settings: { slidesToShow: 2 } },
    { breakpoint: 426, settings: { slidesToShow: 1 } },
  ];
  return (
    <Container>
      <Grid container spacing={3}>
        <Grid item md={3} xs={12}>
          <StyledCard elevation={0}>
            <H3>{data.category.title}</H3>

            {data.category.children && data.category.children.length > 0 && (
              <List sx={{ mb: 2 }}>
                {data.category.children.map((item, index) => (
                  <StyledListItem key={index}>{item.title}</StyledListItem>
                ))}
              </List>
            )}

            <NavLink3
              href="/"
              text="Xem chi tiết"
              color="dark.main"
              hoverColor="dark.main"
            />
          </StyledCard>
        </Grid>
        <Grid item md={9} xs={12}>
          <SliderShow
            slidesToShow={4}
            responsive={responsive}
            arrowStyles={{ backgroundColor: "dark.main" }}
          >
            {data.products.map((product) => (
              <CardProduct2 product={product} key={product.slug} />
            ))}
          </SliderShow>
        </Grid>
      </Grid>
    </Container>
  );
}
