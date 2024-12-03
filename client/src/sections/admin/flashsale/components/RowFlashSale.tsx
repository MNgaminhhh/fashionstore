// RowFlashSale.tsx
import React from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  StyledIconButton,
  StyledTableCell,
  StyledTableRow,
} from "../../../styles";
import { useRouter } from "next/navigation";
import { Tooltip } from "@mui/material";
import FlashSaleModel from "../../../../models/FlashSale.model";
import { format } from "date-fns";

type Props = {
  flashSale: FlashSaleModel;
  onDelete: (id: string) => void;
};

// Helper function to format date and time using date-fns
const formatDateTime = (isoString: string): string => {
  if (!isoString) return "-";
  const date = new Date(isoString);

  if (isNaN(date.getTime())) return "-"; // Invalid date

  // Format: "HH:mm dd/MM/yyyy"
  return format(date, "HH:mm dd/MM/yyyy");
};

export default function RowFlashSale({ flashSale, onDelete }: Props) {
  const router = useRouter();

  const handleEdit = (id: string) => {
    router.push(`/dashboard/vendor/flash-sale/${id}/edit`);
  };

  const handleDelete = (id: string) => {
    onDelete(id);
  };

  return (
    <StyledTableRow tabIndex={-1} role="checkbox">
      <StyledTableCell align="left" sx={{ fontWeight: 500, color: "#333" }}>
        {formatDateTime(flashSale.StartDate)}
      </StyledTableCell>
      <StyledTableCell align="left" sx={{ fontWeight: 500, color: "#333" }}>
        {formatDateTime(flashSale.EndDate)}
      </StyledTableCell>
      <StyledTableCell align="center" sx={{ minWidth: 150 }}>
        <Tooltip title="Chỉnh sửa" arrow>
          <StyledIconButton onClick={() => handleEdit(flashSale.ID)}>
            <EditIcon sx={{ color: "#1976d2" }} />
          </StyledIconButton>
        </Tooltip>
        <Tooltip title="Xoá" arrow>
          <StyledIconButton onClick={() => handleDelete(flashSale.ID)}>
            <DeleteIcon sx={{ color: "#d32f2f" }} />
          </StyledIconButton>
        </Tooltip>
      </StyledTableCell>
    </StyledTableRow>
  );
}
