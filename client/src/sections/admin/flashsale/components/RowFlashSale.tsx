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
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import DisplaySettingsIcon from "@mui/icons-material/DisplaySettings";
dayjs.extend(utc);

type Props = {
  flashSale: FlashSaleModel;
  onDelete: (id: string) => void;
};

const formatDateTime = (dateString: string): string => {
  if (!dateString) return "-";

  try {
    return dayjs.utc(dateString).format("HH:mm:ss YYYY-MM-DD");
  } catch (error) {
    return "-";
  }
};

export default function RowFlashSale({ flashSale, onDelete }: Props) {
  const router = useRouter();

  const handleEdit = (id: string) => {
    router.push(`/dashboard/admin/flash-sale/${id}`);
  };
  const handleFSDetail = (id: string) => {
    router.push(`/dashboard/admin/flash-sale/${id}/flash-items`);
  };
  const handleDelete = (id: string) => {
    onDelete(id);
  };

  return (
    <StyledTableRow tabIndex={-1} role="checkbox">
      <StyledTableCell align="left" sx={{ fontWeight: 400, color: "#333" }}>
        {formatDateTime(flashSale.StartDate)}
      </StyledTableCell>
      <StyledTableCell align="left" sx={{ fontWeight: 400, color: "#333" }}>
        {formatDateTime(flashSale.EndDate)}
      </StyledTableCell>
      <StyledTableCell align="center" sx={{ minWidth: 150 }}>
        <Tooltip title="Cấu hình sản phẩm cho Flash Sale" arrow>
          <StyledIconButton onClick={() => handleFSDetail(flashSale.ID)}>
            <DisplaySettingsIcon sx={{ color: "#000000" }} />
          </StyledIconButton>
        </Tooltip>
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
