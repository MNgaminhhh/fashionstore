import React, { useState, useTransition } from "react";
import { styled } from "@mui/material/styles";
import { Box, IconButton, MenuItem, TextField } from "@mui/material";
import {
  Search as SearchIcon,
  KeyboardArrowDownOutlined,
} from "@mui/icons-material";
import MTMenu from "../MTMenu";
import { FlexBox } from "../flexbox";

const SearchContainer = styled(FlexBox)(({ theme }) => ({
  alignItems: "center",
  borderRadius: "50px",
  backgroundColor: theme.palette.common.white,
  overflow: "hidden",
  width: "100%",
  maxWidth: "500px",
  [theme.breakpoints.down("sm")]: {
    display: "none",
  },
}));

const SearchInput = styled(TextField)(({ theme }) => ({
  flex: 1,
  "& .MuiOutlinedInput-root": {
    padding: theme.spacing(1, 2),
    borderRadius: "50px",
    fontSize: theme.typography.body1.fontSize,
    color: theme.palette.text.primary,
    "&::placeholder": {
      color: theme.palette.text.secondary,
    },
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

const DropDownHandler = styled(FlexBox)(({ theme }) => ({
  whiteSpace: "pre",
  borderTopRightRadius: 300,
  borderBottomRightRadius: 300,
  borderLeft: `1px solid ${theme.palette.text.disabled}`,
  [theme.breakpoints.down("xs")]: {
    display: "none",
  },
}));

const SearchBar: React.FC = () => {
  const [category, setCategory] = useState("All Categories");
  const [_, startTransition] = useTransition();
  const [resultList, setResultList] = useState<string[]>([]);

  const handleCategoryChange = (cat: string) => () => setCategory(cat);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    startTransition(() => {
      const value = e.target?.value;
      if (!value) setResultList([]);
      else setResultList(dummySearchResult);
    });
  };
  const categoryDropdownHandler = (handleOnClick: (event: any) => void) => (
    <DropDownHandler
      px={3}
      gap={0.5}
      height="100%"
      color="grey.700"
      bgcolor="grey.100"
      alignItems="center"
      onClick={handleOnClick}
      style={{ cursor: "pointer" }}
    >
      {category}
      <KeyboardArrowDownOutlined fontSize="small" color="inherit" />
    </DropDownHandler>
  );

  const categoryDropdownOptions = (handleOnClose: () => void) => (
    <>
      {categories.map((item) => (
        <MenuItem
          key={item}
          onClick={() => {
            handleCategoryChange(item)();
            handleOnClose();
          }}
        >
          {item}
        </MenuItem>
      ))}
    </>
  );

  return (
    <Box position="relative" maxWidth="500px" mx="auto">
      <SearchContainer>
        <SearchInput
          fullWidth
          variant="outlined"
          placeholder="Search..."
          onChange={handleSearch}
          InputProps={{
            endAdornment: (
              <MTMenu
                direction="left"
                sx={{ zIndex: 1502 }}
                handler={categoryDropdownHandler}
                options={categoryDropdownOptions}
              />
            ),
          }}
        />
        <SearchButton>
          <SearchIcon />
        </SearchButton>
      </SearchContainer>

      {resultList.length > 0 && (
        <Box
          position="absolute"
          width="100%"
          mt={1}
          bgcolor="white"
          zIndex={10000}
        >
          {resultList.map((item) => (
            <MenuItem key={item}>{item}</MenuItem>
          ))}
        </Box>
      )}
    </Box>
  );
};

const categories = [
  "All Categories",
  "Car",
  "Clothes",
  "Electronics",
  "Laptop",
  "Desktop",
  "Camera",
  "Toys",
];

const dummySearchResult = [
  "Macbook Air 13",
  "Asus K555LA",
  "Acer Aspire X453",
  "iPad Mini 3",
];

export default SearchBar;
