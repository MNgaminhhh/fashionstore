import React, { useState } from "react";
import {
  StyledIconButton,
  StyledTableCell,
  StyledTableRow,
} from "../../../styles";
import Edit from "@mui/icons-material/Edit";
import Delete from "@mui/icons-material/Delete";
import { Box, Tooltip, Typography } from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import MTSwitch from "../../../../components/MTSwitch";

type Props = {
  sku: any;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, newStatus: "active" | "inactive") => void;
};

export default function RowSku({ sku, onDelete, onToggleStatus }: Props) {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const [status, setStatus] = useState<"active" | "inactive">(sku.status);
  const handleToggleStatus = () => {
    const newStatus: "active" | "inactive" =
      status === "active" ? "inactive" : "active";
    setStatus(newStatus);
    onToggleStatus(sku.id, newStatus);
  };
  const handleEdit = (ssid: string) => {
    router.push(`/dashboard/vendor/product/${id}/sku/${ssid}`);
  };

  return (
    <StyledTableRow tabIndex={-1} role="checkbox">
      <StyledTableCell align="left">
        <Box>
          {sku.variants
            ? Object.entries(sku.variants).map(([key, value]) => (
                <Typography key={key} variant="body2">
                  <strong>{key}:</strong> {value as React.ReactNode}
                </Typography>
              ))
            : "-"}
        </Box>
      </StyledTableCell>
      <StyledTableCell align="left">
        <Typography variant="body2">{sku.price || "-"}</Typography>
      </StyledTableCell>
      <StyledTableCell align="left">
        <Typography variant="body2">{sku.offer_price || "-"}</Typography>
      </StyledTableCell>
      <StyledTableCell align="left">
        <Typography variant="body2">{sku.offer || "-"}</Typography>
      </StyledTableCell>
      <StyledTableCell align="left">
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
      <StyledTableCell align="center">
        <Tooltip title="Chỉnh sửa" arrow>
          <StyledIconButton onClick={() => handleEdit(sku.id)}>
            <Edit sx={{ color: "#1976d2" }} />
          </StyledIconButton>
        </Tooltip>
        <Tooltip title="Xoá" arrow>
          <StyledIconButton onClick={() => onDelete(sku.id)}>
            <Delete sx={{ color: "#d32f2f" }} />
          </StyledIconButton>
        </Tooltip>
      </StyledTableCell>
    </StyledTableRow>
  );
}
