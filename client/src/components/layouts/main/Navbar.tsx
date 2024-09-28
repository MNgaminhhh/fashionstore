"use client";
import React, { useState } from "react";
import {
    AppBar,
    Toolbar,
    Box,
    Container,
    Grid,
    IconButton,
    Menu,
    MenuItem,
    Button,
    useMediaQuery,
    useTheme,
    Typography,
    Badge,
    ListItemText,
} from "@mui/material";
import {
    Menu as MenuIcon,
    ShoppingBag as ShoppingBagIcon,
    CompareArrows as CompareIcon,
    HeadsetMic as HeadsetIcon,
    ArrowRight,
} from "@mui/icons-material";
import Image from "next/image";
import logo from "../../../assets/logo.png";
import SearchBar from "./SearchBar";
import Link from "next/link";
export default function Navbar() {
    const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));
    const [anchorEl, setAnchorEl] = useState(null);
    const [subMenuAnchorEl, setSubMenuAnchorEl] = useState(null);
    const [childMenuAnchorEl, setChildMenuAnchorEl] = useState(null);

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSubMenuAnchorEl(null);
        setChildMenuAnchorEl(null);
    };

    const handleCategoryMouseEnter = (event) => {
        setAnchorEl(event.currentTarget);
        setSubMenuAnchorEl(null);
        setChildMenuAnchorEl(null);
    };

    const handleSubMenuMouseEnter = (event) => {
        setSubMenuAnchorEl(event.currentTarget);
        setChildMenuAnchorEl(null);
    };

    const handleChildMenuMouseEnter = (event) => {
        setChildMenuAnchorEl(event.currentTarget);
    };

    const categories = [
        {
            label: "Electronics",
            subCategories: [
                {
                    label: "New Arrivals",
                    childCategories: ["TV & Videos", "Camera", "Photos & Videos"],
                },
                { label: "Best Sellers" },
                {
                    label: "Trending",
                    childCategories: ["Trending Now", "Top Rated"],
                },
            ],
        },
        {
            label: "Fashion",
            subCategories: [
                { label: "Men's Fashion" },
                { label: "Women's Fashion" },
                { label: "Accessories" },
            ],
        },
        {
            label: "Home & Kitchen",
            subCategories: [
                { label: "Furniture" },
                { label: "Kitchen Appliances" },
                { label: "Decor" },
            ],
        },
    ];

    const menuItems = [
        { label: "Trang Chủ", href: "#" },
        { label: "Vendors", href: "#" },
        { label: "Flash Sale", href: "#" },
        { label: "Blog", href: "#" },
        { label: "About", href: "#" },
        { label: "Contact", href: "#" },
    ];

    const renderCategoryItems = () =>
        categories.map((category, index) => (
            <MenuItem
                key={index}
                onMouseEnter={handleSubMenuMouseEnter}
                aria-haspopup="true"
                sx={{ display: "flex", justifyContent: "space-between" }}
            >
                <ListItemText>{category.label}</ListItemText>
                {category.subCategories && <ArrowRight />}
            </MenuItem>
        ));

    return (
        <>
            <AppBar position="static" sx={{ backgroundColor: "black" }}>
                <Container sx={{ maxWidth: "1420px !important" }}>
                    <Toolbar
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            width: "100%",
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                            }}
                        >
                            <Typography
                                variant="h6"
                                noWrap
                                component="div"
                                sx={{
                                    display: { xs: "flex", sm: "block" },
                                    paddingTop: "10px",
                                    paddingBottom: "10px",
                                    width: "170px",
                                }}
                            >
                                <Link href="/" passHref>
                                    <Image src={logo} alt="Logo" />
                                </Link>
                            </Typography>
                        </Box>
                        <SearchBar />
                        <Box
                            sx={{
                                display: { xs: "none", lg: "flex" },
                                alignItems: "center",
                                gap: "20px",
                            }}
                        >
                            <IconButton edge="start" color="inherit">
                                <HeadsetIcon />
                            </IconButton>
                            <Box
                                sx={{
                                    display: { xs: "none", lg: "flex" },
                                    alignItems: "center",
                                    flexDirection: "column",
                                }}
                            >
                                <Typography variant="body2" component="span">
                                    example@gmail.com
                                </Typography>
                                <Typography variant="body2" component="span">
                                    +0123456789
                                </Typography>
                            </Box>
                            <IconButton color="inherit">
                                <Badge badgeContent={3} color="secondary">
                                    <CompareIcon />
                                </Badge>
                            </IconButton>
                            <IconButton color="inherit">
                                <Badge badgeContent={4} color="secondary">
                                    <ShoppingBagIcon />
                                </Badge>
                            </IconButton>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>

            <AppBar position="sticky" color="default" sx={{ backgroundColor: "white", zIndex: 10 }}>
                <Container sx={{ maxWidth: "1420px !important" }}>
                    <Toolbar sx={{ justifyContent: "space-between", alignItems: "center" }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <IconButton
                                edge="start"
                                color="inherit"
                                aria-label="menu"
                                onMouseEnter={handleCategoryMouseEnter}
                            >
                                <MenuIcon />
                            </IconButton>
                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleMenuClose}
                                keepMounted
                                onMouseLeave={handleMenuClose}
                            >
                                {categories.map((category, index) => (
                                    <MenuItem
                                        key={index}
                                        onMouseEnter={handleSubMenuMouseEnter}
                                        aria-haspopup="true"
                                        sx={{ display: "flex", justifyContent: "space-between" }}
                                    >
                                        <ListItemText>{category.label}</ListItemText>
                                        {category.subCategories && <ArrowRight />}
                                    </MenuItem>
                                ))}
                                <Menu
                                    anchorEl={subMenuAnchorEl}
                                    open={Boolean(subMenuAnchorEl)}
                                    onClose={handleMenuClose}
                                    keepMounted
                                    sx={{ '& .MuiPaper-root': { minWidth: 250 } }}
                                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                                    transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                                    onMouseLeave={handleMenuClose}
                                >
                                    {categories.find(cat => cat.label === subMenuAnchorEl?.textContent)?.subCategories.map((sub, subIndex) => (
                                        <MenuItem
                                            key={subIndex}
                                            onMouseEnter={handleChildMenuMouseEnter}
                                            sx={{ display: 'flex', justifyContent: 'space-between' }}
                                        >
                                            <ListItemText>{sub.label}</ListItemText>
                                            {sub.childCategories && <ArrowRight />}
                                        </MenuItem>
                                    ))}
                                    <Menu
                                        anchorEl={childMenuAnchorEl}
                                        open={Boolean(childMenuAnchorEl)}
                                        onClose={handleMenuClose}
                                        keepMounted
                                        sx={{ '& .MuiPaper-root': { minWidth: 250 } }}
                                        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                                        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                                        onMouseLeave={handleMenuClose}
                                    >
                                        {categories
                                            .find(cat => cat.label === subMenuAnchorEl?.textContent)
                                            ?.subCategories.find(sub => sub.label === childMenuAnchorEl?.textContent)
                                            ?.childCategories.map((child, childIndex) => (
                                                <MenuItem key={childIndex} onClick={handleMenuClose}>
                                                    {child}
                                                </MenuItem>
                                            ))}
                                    </Menu>
                                </Menu>
                            </Menu>
                            {isDesktop && (
                                <Grid container sx={{ justifyContent: "center" }}>
                                    {menuItems.map((item) => (
                                        <Button
                                            key={item.label}
                                            color="inherit"
                                            href={item.href}
                                            sx={{ textTransform: "capitalize" }}
                                        >
                                            {item.label.toLowerCase()}
                                        </Button>
                                    ))}
                                </Grid>
                            )}
                            {!isDesktop && (
                                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose} keepMounted>
                                    {renderCategoryItems()}
                                </Menu>
                            )}
                        </Box>

                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Button color="inherit" href="#" sx={{ textTransform: "capitalize" }}>
                                Contact
                            </Button>
                            <Button color="inherit" href="#" sx={{ textTransform: "capitalize" }}>
                                My Account
                            </Button>
                            <Button color="inherit" href="/login" sx={{ textTransform: "capitalize" }}>
                                Đăng Nhập
                            </Button>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
        </>
    );
}
