import React, { useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  StyledIconButton,
  StyledTableCell,
  StyledTableRow,
} from "../../../styles";
import { useRouter } from "next/navigation";
import MTSwitch from "../../../../components/MTSwitch";
import { Box, Tooltip } from "@mui/material";
import VariantModel from "../../../../models/Variant.model";
import DisplaySettingsIcon from "@mui/icons-material/DisplaySettings";

type Props = {
  variant: VariantModel;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, newStatus: string) => void;
};

export default function RowVariant({
  variant,
  onDelete,
  onToggleStatus,
}: Props) {
  const router = useRouter();
  const [status, setStatus] = useState<string>(
    variant.status.toLowerCase() === "active" ? "active" : "inactive"
  );

  const handleEdit = (id: string) => {
    router.push(
      `/dashboard/vendor/product/${variant.productId}/variant/${variant.id}`
    );
  };
  const handleVariant = (id: string) => {
    router.push(
      `/dashboard/vendor/product/${variant.productId}/variant/${variant.id}/option-variant`
    );
  };
  const handleToggleStatus = () => {
    const newStatus = status === "active" ? "inactive" : "active";
    setStatus(newStatus);
    onToggleStatus(variant.id, newStatus);
  };

  return (
    <StyledTableRow tabIndex={-1} role="checkbox">
      <StyledTableCell align="left" sx={{ fontWeight: 500, color: "#333" }}>
        {variant.name || "-"}
      </StyledTableCell>
      <StyledTableCell align="center" sx={{ fontWeight: 400 }}>
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
            checked={status === "active"}
            onChange={handleToggleStatus}
            inputProps={{ "aria-label": "Toggle Variant Status" }}
          />
        </Box>
      </StyledTableCell>
      <StyledTableCell align="center" sx={{ minWidth: 150 }}>
        <Tooltip title="Cấu hình tùy chọn các biến thể" arrow>
          <StyledIconButton onClick={() => handleVariant(variant.id)}>
            <DisplaySettingsIcon sx={{ color: "#000000" }} />
          </StyledIconButton>
        </Tooltip>
        <Tooltip title="Chỉnh sửa" arrow>
          <StyledIconButton onClick={() => handleEdit(variant.id)}>
            <EditIcon sx={{ color: "#1976d2" }} />
          </StyledIconButton>
        </Tooltip>
        <Tooltip title="Xoá" arrow>
          <StyledIconButton onClick={() => onDelete(variant.id)}>
            <DeleteIcon sx={{ color: "#d32f2f" }} />
          </StyledIconButton>
        </Tooltip>
      </StyledTableCell>
    </StyledTableRow>
  );
}
