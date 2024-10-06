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
import banner1 from "../../../../assets/s_banner1.png";
export default function RegisterPage() {
    const router = useRouter();

    return (
        <>
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
                                <Typography variant="h4">Đăng Ký</Typography>
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
                                        <Link href="/" style={{ color: "#fff", textDecoration: "none" }}>Trang Chủ</Link>
                                    </li>
                                    <li>
                                        <span style={{ color: "#fff" }}> / </span>
                                    </li>
                                    <li>
                                        <Link href="/register" style={{ color: "#fff", textDecoration: "none" }}>Đăng Ký</Link>
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
                                    value={1}
                                    indicatorColor="primary"
                                    textColor="primary"
                                    centered
                                >
                                    <Tab
                                        label="Đăng Nhập"
                                        onClick={() => router.push('/login')}
                                    />
                                    <Tab label="Đăng Ký" />
                                </Tabs>

                                <Box sx={{ mt: 3 }}>
                                    <Box component="form">
                                        <TextField
                                            fullWidth
                                            label="Name"
                                            variant="outlined"
                                            margin="normal"
                                            required
                                        />
                                        <TextField
                                            fullWidth
                                            label="Email"
                                            variant="outlined"
                                            margin="normal"
                                            type="email"
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
                                        <TextField
                                            fullWidth
                                            label="Confirm Password"
                                            variant="outlined"
                                            margin="normal"
                                            type="password"
                                            required
                                        />
                                        <Box sx={{ my: 2 }}>
                                            <FormControlLabel
                                                control={<Checkbox />}
                                                label="I consent to the privacy policy"
                                            />
                                        </Box>
                                        <Button
                                            fullWidth
                                            variant="contained"
                                            color="primary"
                                            sx={{ py: 1.5 }}
                                        >
                                            Sign Up
                                        </Button>
                                    </Box>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </section>
        </>
    );
}
