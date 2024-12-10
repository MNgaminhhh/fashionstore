import { useEffect, useState } from "react";
import Link from "next/link";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import { FlexBetween } from "../../../components/flexbox";
import { H4, Span } from "../../../components/Typography";
import { formatCurrency } from "../../../utils/lib";
import useCart from "../../../hooks/useCart";
import { useAppContext } from "../../../context/AppContext";
import Cart from "../../../services/Cart";

export default function CheckoutForm() {
  const { state } = useCart();
  const [coupons, setCoupons] = useState([]);
  const [selectedCouponCode, setSelectedCouponCode] = useState("");
  const { sessionToken } = useAppContext();
  const getTotalPrice = () =>
    state.cart.reduce((acc, item) => acc + item.total_price, 0);

  useEffect(() => {
    async function fetchCoupons() {
      try {
        const res = await Cart.getCouponsCanUse(sessionToken);
        console.log(res.data);
        if (res?.success || res?.data?.success) {
          setCoupons(res?.data);
        }
      } catch (error) {}
    }

    fetchCoupons();
  }, []);

  const handleCouponClick = (code) => {
    setSelectedCouponCode(code);
  };

  return (
    <Card sx={{ padding: 3 }}>
      <FlexBetween mb={2}>
        <Span color="grey.600">Tổng tiền:</Span>
        <Span fontSize={18} fontWeight={600} lineHeight="1">
          {formatCurrency(getTotalPrice())}
        </Span>
      </FlexBetween>

      <Divider sx={{ mb: 2 }} />

      <TextField
        fullWidth
        size="small"
        label="Mã giảm giá"
        variant="outlined"
        placeholder="Nhập mã giảm giá..."
        value={selectedCouponCode}
        onChange={(e) => setSelectedCouponCode(e.target.value)}
      />

      <Button
        variant="outlined"
        color="primary"
        fullWidth
        sx={{ mt: 2, mb: 4 }}
      >
        Áp dụng
      </Button>
      <H4>Các mã giảm giá:</H4>
      {coupons && coupons.length > 0 && (
        <>
          <Divider sx={{ mb: 2 }} />
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
            {coupons.map((coupon) => (
              <Tooltip key={coupon.id} title={coupon.name || ""} arrow>
                <Button
                  variant="contained"
                  onClick={() => handleCouponClick(coupon.code)}
                  sx={{ textTransform: "none" }}
                >
                  {coupon.code}
                </Button>
              </Tooltip>
            ))}
          </Box>
        </>
      )}

      <Divider sx={{ mb: 2 }} />

      <Button
        fullWidth
        color="primary"
        href="/checkout"
        variant="contained"
        LinkComponent={Link}
      >
        Thanh toán ngay
      </Button>
    </Card>
  );
}
