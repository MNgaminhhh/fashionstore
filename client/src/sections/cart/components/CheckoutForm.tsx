"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import { FlexBetween } from "../../../components/flexbox";
import { H4, Span } from "../../../components/Typography";
import { formatCurrency } from "../../../utils/lib";
import useCart from "../../../hooks/useCart";
import { useAppContext } from "../../../context/AppContext";
import Cart from "../../../services/Cart";
import Address from "../../../services/Address";
import AddressForm from "../../customer/myaddress/components/AddressForm";
import AddIcon from "@mui/icons-material/Add";
import {
  DialogTitle,
  Stack,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { notifyError, notifySuccess } from "../../../utils/ToastNotification";
import { useRouter } from "next/navigation";

interface Props {
  status?: boolean;
}

export default function CheckoutForm({ status = false }: Props) {
  const { state } = useCart();
  const { sessionToken } = useAppContext();
  const router = useRouter();

  const [coupons, setCoupons] = useState<any[]>([]);
  const [selectedCouponCode, setSelectedCouponCode] = useState("");

  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");

  const [openDialog, setOpenDialog] = useState(false);
  const [payingMethod, setPayingMethod] = useState<"COD" | "QR_CODE" | null>(
    null
  );

  const getTotalPrice = () =>
    state?.cart
      ?.filter((item) => item.selected)
      .reduce((acc, item) => acc + item.total_price, 0);

  const fetchData = async () => {
    try {
      const [couponsRes, addressRes] = await Promise.all([
        Cart.getCouponsCanUse(sessionToken),
        Address.getListAddress(sessionToken),
      ]);

      if (couponsRes?.success || couponsRes?.data?.success) {
        setCoupons(couponsRes?.data || []);
      }

      if (addressRes?.success || addressRes?.data?.success) {
        setAddresses(addressRes?.data || []);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [sessionToken]);

  const handleCouponClick = (code: string) => {
    setSelectedCouponCode(code);
  };

  const handleAddressClick = (id: string) => {
    setSelectedAddressId(id);
  };

  const handleCloseDialog = (refresh: boolean = false) => {
    setOpenDialog(false);
    if (refresh) {
      fetchData();
    }
  };

  const handleOrder = async () => {
    const selectedItems = state.cart.filter((item) => item.selected);
    if (selectedItems.length === 0) {
      notifyError("Chưa có sản phẩm để thanh toán");
      return;
    }
    if (!selectedAddressId) {
      notifyError("Vui lòng chọn địa chỉ giao hàng");
      return;
    }
    if (!payingMethod) {
      notifyError("Vui lòng chọn phương thức thanh toán");
      return;
    }

    const skus = selectedItems.map((item) => ({
      sku_id: item.sku_id,
      quantity: item.quantity,
    }));

    const data: any = {
      skus,
      paying_method: payingMethod,
      delivery_info: selectedAddressId,
    };

    if (selectedCouponCode) {
      const coupon = coupons.find((c) => c.code === selectedCouponCode);
      if (coupon?.id) {
        data.product_coupon = coupon.id;
      }
    }

    try {
      const res = await Cart.orderBill(data, sessionToken);
      if (res?.success || res?.data?.success) {
        notifySuccess("Tạo đơn hàng thành công!");
        const checkoutUrl = res?.data?.data?.checkoutUrl;
        if (checkoutUrl) {
          router.push(checkoutUrl);
        } else {
          router.push("/orders");
          router.refresh();
        }
      } else {
        const errorMessage =
          res?.data?.message || res?.message || "Vui lòng thử lại.";
        notifyError(`Tạo đơn hàng thất bại: ${errorMessage}`);
      }
    } catch (error: any) {
      notifyError("Đã xảy ra lỗi trong quá trình tạo đơn hàng!");
      console.error(error);
    }
  };

  const handlePaymentClick = () => {
    if (status) {
      handleOrder();
    } else {
      router.push("/checkout");
    }
  };

  const isDisabled =
    state?.cart?.filter((item) => item.selected).length === 0 ||
    (status && (!selectedAddressId || !payingMethod));

  return (
    <Card sx={{ padding: 3 }}>
      <FlexBetween mb={2}>
        <Span color="grey.600">Tổng tiền:</Span>
        <Span fontSize={18} fontWeight={600} lineHeight="1">
          {formatCurrency(getTotalPrice())}
        </Span>
      </FlexBetween>

      {status && (
        <>
          <Divider sx={{ mb: 2 }} />
          <H4>Địa chỉ giao hàng:</H4>
          {addresses && addresses.length > 0 ? (
            <>
              <Divider sx={{ mb: 2, mt: 1 }} />
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
                {addresses.map((address) => (
                  <Tooltip
                    key={address.id}
                    title={`${address.receiver_name} - ${address.phone_number}`}
                    arrow
                  >
                    <Button
                      variant={
                        selectedAddressId === address.id
                          ? "contained"
                          : "outlined"
                      }
                      onClick={() => handleAddressClick(address.id)}
                      sx={{ textTransform: "none" }}
                    >
                      {address.address}
                    </Button>
                  </Tooltip>
                ))}
                <Button
                  variant="outlined"
                  onClick={() => setOpenDialog(true)}
                  sx={{ textTransform: "none" }}
                >
                  <AddIcon />
                </Button>
              </Box>
            </>
          ) : (
            <Box sx={{ mb: 2 }}>
              Chưa có địa chỉ.{" "}
              <Button
                variant="outlined"
                onClick={() => setOpenDialog(true)}
                sx={{ textTransform: "none", ml: 1 }}
              >
                <AddIcon />
              </Button>
            </Box>
          )}

          <Divider sx={{ mb: 2 }} />
          <H4>Phương thức thanh toán:</H4>
          <RadioGroup
            value={payingMethod}
            onChange={(e) =>
              setPayingMethod(e.target.value as "COD" | "QR_CODE")
            }
            row
            sx={{ mb: 2, mt: 1 }}
          >
            <FormControlLabel
              value="COD"
              control={<Radio />}
              label="Thanh toán khi nhận hàng (COD)"
            />
            <FormControlLabel
              value="QR_CODE"
              control={<Radio />}
              label="Thanh toán bằng QR Code"
            />
          </RadioGroup>
          <Divider sx={{ mb: 2 }} />
          <H4>Các mã giảm giá:</H4>

          {coupons && coupons.length > 0 ? (
            <>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
                {coupons.map((coupon) => (
                  <Tooltip key={coupon.id} title={coupon.name || ""} arrow>
                    <Button
                      variant={
                        selectedCouponCode === coupon.code
                          ? "contained"
                          : "outlined"
                      }
                      onClick={() => handleCouponClick(coupon.code)}
                      sx={{ textTransform: "none" }}
                    >
                      {coupon.code}
                    </Button>
                  </Tooltip>
                ))}
              </Box>
            </>
          ) : (
            <Box sx={{ mb: 2 }}>Không có mã giảm giá</Box>
          )}
          <Divider sx={{ mb: 2 }} />
        </>
      )}

      <Button
        fullWidth
        color="primary"
        variant="contained"
        disabled={isDisabled}
        onClick={handlePaymentClick}
      >
        Thanh toán
      </Button>

      <Dialog
        open={openDialog}
        onClose={() => handleCloseDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Stack direction="row" alignItems="center" spacing={1}>
            <AddIcon />
            <span>Thêm địa chỉ mới</span>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <AddressForm />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleCloseDialog(false)}>Đóng</Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}
