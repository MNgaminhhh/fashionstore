"use client";

import { PropsWithChildren } from "react";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Navigation from "./Navigation";

export default function CustomerLayout({ children }: PropsWithChildren) {
    return (
        <Container sx={{ mt: 2, mb: 2 }}>
            <Grid container spacing={3}>
                <Grid item lg={3} md={4} xs={12} sx={{ display: { xs: "none", md: "block" } }}>
                    <Navigation />
                </Grid>

                <Grid item lg={9} md={8} xs={12}>
                    {children}
                </Grid>
            </Grid>
        </Container>
    );
}
