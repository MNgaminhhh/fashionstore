"use client";

import React, { useState, useEffect, useRef, Fragment } from "react";
import { styled } from "@mui/material/styles";
import {
  Box,
  IconButton,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Avatar,
  ListItemAvatar,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import Products from "../../../../services/Products";
import { get } from "lodash";

const SearchContainer = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  borderRadius: "50px",
  backgroundColor: theme.palette.common.white,
  overflow: "hidden",
  width: "100%",
  maxWidth: "500px",
  position: "relative",
}));

const SearchInput = styled("input")(({ theme }) => ({
  border: "none",
  padding: theme.spacing(1, 2),
  outline: "none",
  flex: 1,
  color: "black",
  fontSize: theme.typography.body1.fontSize,
  "&::placeholder": {
    color: theme.palette.text.secondary,
  },
}));

const SearchButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: theme.palette.primary.light,
  color: theme.palette.primary.contrastText,
  borderRadius: "50%",
  margin: theme.spacing(0.5),
  "&:hover": {
    backgroundColor: theme.palette.primary.main,
  },
}));

interface Product {
  id: string;
  name: string;
  images?: string[];
  lowest_price?: number;
  highest_price?: number;
}

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!searchTerm) {
      setSearchResults([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      try {
        const res = await Products.getAllProduct(10, 1, { name: searchTerm });
        const listproduct = get(res, "data.data.products", []);
        if (res?.data?.success) {
          setSearchResults(listproduct);
        } else {
          setSearchResults([]);
        }
      } catch (error) {
        setSearchResults([]);
      }
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const handleSearch = () => {
    if (!searchTerm) return;
    router.push(`/product?name=${encodeURIComponent(searchTerm)}`);
    setSearchResults([]);
  };

  const handleProductClick = (productName: string) => {
    router.push(`/product?name=${encodeURIComponent(productName)}`);
    setSearchResults([]);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      containerRef.current &&
      !containerRef.current.contains(event.target as Node)
    ) {
      setSearchResults([]);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <Box
      sx={{ width: "100%", maxWidth: "500px", position: "relative" }}
      ref={containerRef}
    >
      <SearchContainer>
        <SearchInput
          type="text"
          placeholder="Nhập tên sản phẩm..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <SearchButton onClick={handleSearch}>
          <SearchIcon />
        </SearchButton>
      </SearchContainer>

      {searchResults?.length > 0 && (
        <Paper
          sx={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            mt: 1,
            maxHeight: 300,
            overflowY: "auto",
            zIndex: 999,
            borderRadius: 2,
            boxShadow: 3,
          }}
        >
          <List sx={{ p: 0 }}>
            {searchResults.map((product) => {
              const imageUrl =
                product.images && product.images.length > 0
                  ? product.images[0]
                  : "https://i.postimg.cc/8CsyxN8Y/b19c4660-aae8-481c-ab39-93636dd0d500.jpg";
              const priceText =
                product.lowest_price && product.highest_price
                  ? product.lowest_price === product.highest_price
                    ? `Giá: ${product.lowest_price.toLocaleString("vi-VN")}đ`
                    : `Giá: ${product.lowest_price.toLocaleString(
                        "vi-VN"
                      )}đ - ${product.highest_price.toLocaleString("vi-VN")}đ`
                  : "Chưa có giá";

              return (
                <Fragment key={product.id}>
                  <ListItem
                    button
                    onClick={() => handleProductClick(product.name)}
                    sx={{
                      "&:hover": {
                        backgroundColor: "action.hover",
                      },
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar
                        src={imageUrl}
                        alt={product.name}
                        sx={{ width: 50, height: 50 }}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={product.name}
                      secondary={priceText}
                      primaryTypographyProps={{
                        variant: "body1",
                        fontWeight: 500,
                      }}
                      secondaryTypographyProps={{
                        variant: "body2",
                        color: "text.secondary",
                      }}
                    />
                  </ListItem>
                  <Divider component="li" />
                </Fragment>
              );
            })}
          </List>
        </Paper>
      )}
    </Box>
  );
}
