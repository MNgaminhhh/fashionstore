"use client";

import { useState, Fragment } from "react";
import Place from "@mui/icons-material/Place";
import AddressModel from "../../../../models/Address.model";
import Header from "../../components/Header";
import AddressListItem from "../components/AddressListItem";
import Pagination from "../../components/Pagination";
import DialogBox from "../../../../components/dialog/DialogBox";
import Address from "../../../../services/Address";
import { useAppContext } from "../../../../context/AppContext";
import {
  notifyError,
  notifySuccess,
} from "../../../../utils/ToastNotification";
import { Box, Typography } from "@mui/material";
import { H5 } from "../../../../components/Typography";

type Props = { addressList: AddressModel[] };

const ITEMS_PER_PAGE = 10;

export default function MyAddressView({ addressList }: Props) {
  const { sessionToken } = useAppContext();
  const [allAddress, setAllAddress] = useState<AddressModel[]>(
    addressList || []
  );
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const openDeleteDialog = (id: string) => {
    setSelectedAddress(id);
    setDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDialogOpen(false);
    setSelectedAddress(null);
  };

  const handleAddressDelete = async () => {
    if (selectedAddress) {
      setIsDeleting(true);
      try {
        const response = await Address.delete(selectedAddress, sessionToken);

        if (response.data.success) {
          notifySuccess("Địa chỉ đã được xoá thành công");
          setAllAddress((prev) =>
            prev.filter((address) => address.id !== selectedAddress)
          );
          const totalPages = Math.ceil(
            (allAddress.length - 1) / ITEMS_PER_PAGE
          );
          if (currentPage > totalPages) {
            setCurrentPage(totalPages > 0 ? totalPages : 1);
          }
        } else {
          notifyError(
            "Xoá Địa chỉ thất bại: " +
              (response.data.message || "Vui lòng thử lại.")
          );
        }
      } catch (error: any) {
        console.error("Error deleting address:", error);
      } finally {
        setIsDeleting(false);
        closeDeleteDialog();
      }
    }
  };

  const totalPages = Math.ceil(allAddress.length / ITEMS_PER_PAGE);
  const paginatedAddresses = allAddress.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentPage(value);
  };

  return (
    <>
      <Fragment>
        <Header
          Icon={Place}
          href="/my-address/create"
          title="Địa chỉ của tôi"
          buttonText="Thêm Địa Chỉ Mới"
        />

        {paginatedAddresses.length > 0 ? (
          paginatedAddresses.map((address) => (
            <AddressListItem
              key={address.id}
              addressData={address}
              handleDelete={openDeleteDialog}
            />
          ))
        ) : (
          <Box mt={4}>
            <H5 align="center">Không có địa chỉ nào. Hãy thêm địa chỉ mới!</H5>
          </Box>
        )}

        {totalPages > 1 && (
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
          />
        )}
      </Fragment>
      <DialogBox
        open={dialogOpen}
        onClose={closeDeleteDialog}
        onConfirm={handleAddressDelete}
        title="Xác nhận xoá"
        description="Bạn có chắc chắn muốn xoá địa chỉ này?"
        confirmText="Xoá"
        cancelText="Hủy"
        loading={isDeleting}
      />
    </>
  );
}
