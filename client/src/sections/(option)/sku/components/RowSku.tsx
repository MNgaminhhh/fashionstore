import React from "react";
import {
  StyledIconButton,
  StyledTableCell,
  StyledTableRow,
} from "../../../styles";
import Edit from "@mui/icons-material/Edit";
import Delete from "@mui/icons-material/Delete";
import { Box, Tooltip, Typography } from "@mui/material";

type Props = {
  sku: any;
  onDelete: (id: string) => void;
};

export default function RowSku({ sku, onDelete }: Props) {
  const handleEdit = (id: string) => {
    window.location.href = `/dashboard/vendor/sku/${id}/edit`;
  };

  return (
    <StyledTableRow tabIndex={-1} role="checkbox">
      <StyledTableCell align="left">
        <Box>
          {sku.variants
            ? Object.entries(sku.variants).map(([key, value]) => (
                <Typography key={key} variant="body2">
                  <strong>{key}:</strong> {value}
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
