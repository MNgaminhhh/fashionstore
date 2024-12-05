"use client";

import {
  StyledTableCell,
  StyledTableRow,
  StyledIconButton,
} from "../../../../styles";
import { Edit, Delete } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import MTSwitch from "../../../../../components/MTSwitch";

type Props = {
  subcategory: {
    id: string;
    name: string;
    nameCode: string;
    parent: string;
    url: string;
    icon: string;
    status: string;
  };
  onDelete: (id: string) => void;
  onToggleVisibility: (id: string, status: number) => void;
};

export default function RowSubCategories({
  subcategory,
  onDelete,
  onToggleVisibility,
}: Props) {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(subcategory?.status === 1);

  const handleEdit = (id: string) => {
    router.push(`/dashboard/admin/categories/sub-category/${id}`);
  };

  const handleToggleVisibility = () => {
    const newStatus = isVisible ? 0 : 1;
    setIsVisible(!isVisible);
    onToggleVisibility(subcategory.id, newStatus);
  };

  return (
    <StyledTableRow tabIndex={-1} role="checkbox">
      <StyledTableCell align="left" sx={{ fontWeight: 400 }}>
        {subcategory?.name || "-"}
      </StyledTableCell>
      <StyledTableCell align="left" sx={{ fontWeight: 400 }}>
        {subcategory?.nameCode || "-"}
      </StyledTableCell>
      <StyledTableCell align="left" sx={{ fontWeight: 400 }}>
        {subcategory?.parent || "-"}
      </StyledTableCell>
      <StyledTableCell align="left" sx={{ fontWeight: 400 }}>
        {subcategory?.url || "-"}
      </StyledTableCell>
      <StyledTableCell align="center">
        <MTSwitch
          color="info"
          checked={isVisible}
          onChange={handleToggleVisibility}
        />
      </StyledTableCell>
      <StyledTableCell align="center">
        <Box display="flex" justifyContent="center">
          <StyledIconButton onClick={() => handleEdit(subcategory.id)}>
            <Edit />
          </StyledIconButton>
          <StyledIconButton onClick={() => onDelete(subcategory.id)}>
            <Delete />
          </StyledIconButton>
        </Box>
      </StyledTableCell>
    </StyledTableRow>
  );
}
