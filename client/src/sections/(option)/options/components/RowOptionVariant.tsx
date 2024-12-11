import React, { useState } from "react";
import Edit from "@mui/icons-material/Edit";
import Delete from "@mui/icons-material/Delete";
import {
  StyledIconButton,
  StyledTableCell,
  StyledTableRow,
} from "../../../styles";
import { useParams, useRouter } from "next/navigation";
import MTSwitch from "../../../../components/MTSwitch";
import { Box, Tooltip } from "@mui/material";
import OptionVariantModel from "../../../../models/OptionVariant.model";

type Props = {
  optionVariant: OptionVariantModel;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, newStatus: "active" | "inactive") => void;
};

export default function RowOptionVariant({
  optionVariant,
  onDelete,
  onToggleStatus,
}: Props) {
  const router = useRouter();
  const params = useParams();
  const { id, vid } = params;
  const [status, setStatus] = useState<"active" | "inactive">(
    optionVariant.status
  );

  const handleEdit = (oid: string) => {
    router.push(
      `/dashboard/vendor/product/${id}/variant/${vid}/option-variant/${oid}`
    );
  };

  const handleToggleStatus = () => {
    const newStatus: "active" | "inactive" =
      status === "active" ? "inactive" : "active";
    setStatus(newStatus);
    onToggleStatus(optionVariant.id, newStatus);
  };

  return (
    <StyledTableRow tabIndex={-1} role="checkbox">
      <StyledTableCell align="left" sx={{ fontWeight: 500, color: "#333" }}>
        {optionVariant.name || "-"}
      </StyledTableCell>

      <StyledTableCell align="left" sx={{ fontWeight: 400, color: "#555" }}>
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
        <Tooltip title="Chỉnh sửa" arrow>
          <StyledIconButton onClick={() => handleEdit(optionVariant.id)}>
            <Edit sx={{ color: "#1976d2" }} />
          </StyledIconButton>
        </Tooltip>
        <Tooltip title="Xoá" arrow>
          <StyledIconButton onClick={() => onDelete(optionVariant.id)}>
            <Delete sx={{ color: "#d32f2f" }} />
          </StyledIconButton>
        </Tooltip>
      </StyledTableCell>
    </StyledTableRow>
  );
}
