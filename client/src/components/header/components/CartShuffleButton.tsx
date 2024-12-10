import React from "react";
import Badge from "@mui/material/Badge";
import IconButton from "@mui/material/IconButton";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Profile from "../../profile/Profile";
import { useAppContext } from "../../../context/AppContext";
import Link from "next/link";
import useCart from "../../../hooks/useCart";
const CustomBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#FF0000",
    color: "white",
    fontSize: "0.8rem",
    borderRadius: "50%",
    padding: "4px",
    minWidth: "22px",
    height: "22px",
  },
}));

export default function NotificationButtons() {
  const { sessionToken, cart } = useAppContext();
  const { state } = useCart();
  const cartCount =
    typeof cart !== "undefined" && cart !== null
      ? cart
      : Array.isArray(state.cart)
      ? state.cart.length
      : 0;
  return (
    <Box display="flex" justifyContent="center" alignItems="center" gap={3}>
      <Link href="/cart" passHref>
        <CustomBadge badgeContent={cartCount}>
          <IconButton aria-label="shopping-bag" style={{ color: "white" }}>
            <ShoppingBagIcon style={{ fontSize: "30px" }} />
          </IconButton>
        </CustomBadge>
      </Link>
      {!sessionToken ? null : <Profile />}
    </Box>
  );
}
