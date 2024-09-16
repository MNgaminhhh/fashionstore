import React from "react";
import { Box, Typography, IconButton, Grid, Container, Link, TextField, Button } from "@mui/material";
import { Facebook, Twitter, Instagram, Pinterest, WhatsApp, Phone, Email, LocationOn } from "@mui/icons-material";
import logo from "../../../assets/logo.png";
import Image from "next/image";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <Box
            component="footer"
            sx={{
                backgroundColor: "grey.900",
                color: "#fff",
                pt: 5,
            }}
        >
            <Container maxWidth="lg">
                <Grid container spacing={20}>
                    <Grid item xs={20} md={4}>
                        <Typography
                            variant="h6"
                            noWrap
                            component="div"
                            sx={{
                                display: {xs: "flex", sm: "block"},
                                paddingTop: "10px",
                                paddingBottom: "20px",
                                width: "250px",
                            }}
                        >
                            <Image src={logo} alt="Logo"/>
                        </Typography>
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <Phone sx={{ mr: 1 }} /> +0123456789
                            </Typography>
                            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <Email sx={{ mr: 1 }} /> example@gmail.com
                            </Typography>
                            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                                <LocationOn sx={{ mr: 1 }} /> Thủ Đức, TP. Hồ Chí Minh
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', gap: 2, justifyContent: { xs: 'center', md: 'flex-start' } }}>
                            <IconButton sx={{
                                color: "#fff",
                                backgroundColor: "#4267B2",
                                borderRadius: "50%",
                                padding: 1,
                                "&:hover": {
                                    backgroundColor: "#365899",
                                },
                            }}>
                                <Facebook />
                            </IconButton>
                            <IconButton sx={{
                                color: "#fff",
                                backgroundColor: "#1DA1F2",
                                borderRadius: "50%",
                                padding: 1,
                                "&:hover": {
                                    backgroundColor: "#0a95e0",
                                },
                            }}>
                                <Twitter />
                            </IconButton>
                            <IconButton sx={{
                                color: "#fff",
                                backgroundColor: "#25D366",
                                borderRadius: "50%",
                                padding: 1,
                                "&:hover": {
                                    backgroundColor: "#1ebc57",
                                },
                            }}>
                                <WhatsApp />
                            </IconButton>
                            <IconButton sx={{
                                color: "#fff",
                                backgroundColor: "#E60023",
                                borderRadius: "50%",
                                padding: 1,
                                "&:hover": {
                                    backgroundColor: "#b8001b",
                                },
                            }}>
                                <Pinterest />
                            </IconButton>
                            <IconButton sx={{
                                color: "#fff",
                                backgroundColor: "#E1306C",
                                borderRadius: "50%",
                                padding: 1,
                                "&:hover": {
                                    backgroundColor: "#c82861",
                                },
                            }}>
                                <Instagram />
                            </IconButton>
                        </Box>

                    </Grid>

                    <Grid item xs={16} md={4}>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Typography variant="h6" sx={{ mb: 1 }}>
                                    Company
                                </Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                    <Link href="#" underline="none" sx={{ color: "#fff", "&:hover": { color: "#2A9CF5" } }}>
                                        About Us
                                    </Link>
                                    <Link href="#" underline="none" sx={{ color: "#fff", "&:hover": { color: "#2A9CF5" } }}>
                                        Team Member
                                    </Link>
                                    <Link href="#" underline="none" sx={{ color: "#fff", "&:hover": { color: "#2A9CF5" } }}>
                                        Career
                                    </Link>
                                    <Link href="#" underline="none" sx={{ color: "#fff", "&:hover": { color: "#2A9CF5" } }}>
                                        Contact Us
                                    </Link>
                                </Box>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="h6" sx={{ mb: 1 }}>
                                    Company
                                </Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                    <Link href="#" underline="none" sx={{ color: "#fff", "&:hover": { color: "#2A9CF5" } }}>
                                        Affiliate
                                    </Link>
                                    <Link href="#" underline="none" sx={{ color: "#fff", "&:hover": { color: "#2A9CF5" } }}>
                                        Order History
                                    </Link>
                                    <Link href="#" underline="none" sx={{ color: "#fff", "&:hover": { color: "#2A9CF5" } }}>
                                        Order History
                                    </Link>
                                    <Link href="#" underline="none" sx={{ color: "#fff", "&:hover": { color: "#2A9CF5" } }}>
                                        Team Member
                                    </Link>
                                </Box>
                            </Grid>
                        </Grid>
                    </Grid>

                </Grid>
            </Container>

            <Box
                sx={{
                    textAlign: "center",
                    mt: 4,
                    backgroundColor: "grey.800",
                    py: 2,
                }}
            >
                <Typography variant="body2" sx={{ color: "grey.300" }}>
                    &copy; {currentYear}. All rights reserved.
                </Typography>
            </Box>
        </Box>
    );
}
