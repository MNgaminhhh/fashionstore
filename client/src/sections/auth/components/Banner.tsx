import { Box, Container, Grid, Typography } from "@mui/material";
import Link from "next/link";
import {StyledContainer, StyledList, StyledSection} from "../styles";
interface BannerSectionProps {
    title: string;
    bannerImage: string;
    breadcrumb: { name: string; href: string }[];
}

export const Banner = ({ title, bannerImage, breadcrumb }: BannerSectionProps) => {
    return (
        <StyledSection sx={{ backgroundImage: `url(${bannerImage})` }}>
            <StyledContainer>
                <Grid container justifyContent="left">
                    <Grid item xs={12} textAlign="left">
                        <Typography variant="h4">{title}</Typography>
                        <StyledList>
                            {breadcrumb.map((item, index) => (
                                <li key={index}>
                                    {item.href ? (
                                        <Link href={item.href} style={{ color: "#fff", textDecoration: "none" }}>
                                            {item.name}
                                        </Link>
                                    ) : (
                                        <span style={{ color: "#fff" }}>{item.name}</span>
                                    )}
                                    {index < breadcrumb.length - 1 && <span style={{ color: "#fff" }}> / </span>}
                                </li>
                            ))}
                        </StyledList>
                    </Grid>
                </Grid>
            </StyledContainer>
        </StyledSection>
    );
};
