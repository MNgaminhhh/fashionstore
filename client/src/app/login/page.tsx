"use client";
import React from "react";
import {
    Container,
    Box,
    Grid,
    TextField,
    Button,
    Checkbox,
    FormControlLabel,
    Typography,
    Tabs,
    Tab,
} from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import banner1 from "../../assets/s_banner1.png";
import Navbar from "../../components/layouts/main/Navbar";
import Footer from "../../components/layouts/main/Footer";

export default function LoginPage() {
    const router = useRouter();

    return (
        <>
            <Navbar />
            <section>
                <Box
                    sx={{
                        backgroundImage: `url(${banner1.src})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        py: 10,
                        color: "#fff",
                        position: "relative",
                        "::before": {
                            content: '""',
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            backgroundColor: "rgba(0, 0, 0, 0.5)",
                            zIndex: 1,
                        },
                    }}
                >
                    <Container sx={{ position: "relative", zIndex: 2 }}>
                        <Grid container justifyContent="left">
                            <Grid item xs={12} textAlign="left">
                                <Typography variant="h4">Login</Typography>
                                <Box
                                    component="ul"
                                    sx={{
                                        listStyle: "none",
                                        display: "flex",
                                        justifyContent: "left",
                                        gap: 2,
                                        mt: 2,
                                    }}
                                >
                                    <li>
                                        <Link href="/" style={{ color: "#fff", textDecoration: "none" }}>Home</Link>
                                    </li>
                                    <li>
                                        <span style={{ color: "#fff" }}> / </span>
                                    </li>
                                    <li>
                                        <Link href="/login" style={{ color: "#fff", textDecoration: "none" }}>Login</Link>
                                    </li>
                                </Box>
                            </Grid>
                        </Grid>
                    </Container>
                </Box>

            </section>

            <section>
                <Container sx={{ py: 6 }}>
                    <Grid container justifyContent="center">
                        <Grid item xs={12} md={5}>
                            <Box sx={{ boxShadow: 3, p: 4, borderRadius: 2, backgroundColor: "#fff" }}>
                                <Tabs
                                    value={0}
                                    indicatorColor="primary"
                                    textColor="primary"
                                    centered
                                >
                                    <Tab label="Login" />
                                    <Tab
                                        label="Register"
                                        onClick={() => router.push('/register')}
                                    />
                                </Tabs>

                                <Box sx={{ mt: 3 }}>
                                    <Box component="form">
                                        <TextField
                                            fullWidth
                                            label="User Name"
                                            variant="outlined"
                                            margin="normal"
                                            required
                                        />
                                        <TextField
                                            fullWidth
                                            label="Password"
                                            variant="outlined"
                                            margin="normal"
                                            type="password"
                                            required
                                        />
                                        <Box
                                            sx={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                my: 2,
                                            }}
                                        >
                                            <FormControlLabel
                                                control={<Checkbox />}
                                                label="Remember me"
                                            />
                                            <Link
                                                href="/forgot-password"
                                                style={{
                                                    color: "#2A9CF5",
                                                    textDecoration: "none",
                                                }}
                                            >
                                                Forget password?
                                            </Link>
                                        </Box>
                                        <Button
                                            fullWidth
                                            variant="contained"
                                            color="primary"
                                            sx={{ py: 1.5 }}
                                        >
                                            Login
                                        </Button>
                                    </Box>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </section>

            <Footer />
        </>
    );
}
