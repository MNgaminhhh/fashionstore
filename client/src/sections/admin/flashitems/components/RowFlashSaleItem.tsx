import React from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  StyledIconButton,
  StyledTableCell,
  StyledTableRow,
} from "../../../styles";
import { useParams, useRouter } from "next/navigation";
import { Tooltip, Box } from "@mui/material";
import FlashSaleItemModel from "../../../../models/FlashSaleItem.model";
import MTSwitch from "../../../../components/MTSwitch";

type Props = {
  flashSaleItem: FlashSaleItemModel;
  onDelete: (id: string) => void;
  handleToggleShow: (id: string, newStatus: any) => void;
};

export default function RowFlashSaleItem({
  flashSaleItem,
  onDelete,
  handleToggleShow,
}: Props) {
  const router = useRouter();
  const param = useParams();
  const { id } = param;
  const productId = Array.isArray(id) ? id[0] : id;
  const handleEdit = (id: string) => {
    router.push(`/dashboard/admin/flash-sale/${productId}/flash-items/${id}`);
  };

  const handleDelete = (id: string) => {
    onDelete(id);
  };
  const handleSwitchChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: any
  ) => {
    handleToggleShow(flashSaleItem.id, checked);
  };
  return (
    <StyledTableRow tabIndex={-1} role="checkbox">
      <StyledTableCell align="left" sx={{ fontWeight: 400, color: "#333" }}>
        {flashSaleItem.product_name || "-"}
      </StyledTableCell>
      <StyledTableCell align="left" sx={{ fontWeight: 400, color: "#333" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 1,
          }}
        >
          <MTSwitch
            color="info"
            checked={flashSaleItem.show}
            onChange={handleSwitchChange}
            inputProps={{ "aria-label": "Toggle Variant Status" }}
          />
        </Box>
      </StyledTableCell>
      <StyledTableCell align="center" sx={{ minWidth: 150 }}>
        <Tooltip title="Chỉnh sửa" arrow>
          <StyledIconButton onClick={() => handleEdit(flashSaleItem.id)}>
            <EditIcon sx={{ color: "#1976d2" }} />
          </StyledIconButton>
        </Tooltip>
        <Tooltip title="Xoá" arrow>
          <StyledIconButton onClick={() => handleDelete(flashSaleItem.id)}>
            <DeleteIcon sx={{ color: "#d32f2f" }} />
          </StyledIconButton>
        </Tooltip>
      </StyledTableCell>
    </StyledTableRow>
  );
}
