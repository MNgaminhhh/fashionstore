"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Edit, Delete } from "@mui/icons-material";
import { Box } from "@mui/material";
import {
  StyledTableCell,
  StyledTableRow,
  StyledIconButton,
} from "../../../../../styles";
import MTSwitch from "../../../../../../components/MTSwitch";
import ChildCategoryModel from "../../../../../../models/ChildCategory.model";

type Props = {
  childCategory: ChildCategoryModel;
  onDelete: (id: string) => void;
  onToggleVisibility: (id: string, status: string) => void;
};

export default function RowChildCategory({
  childCategory,
  onDelete,
  onToggleVisibility,
}) {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(childCategory.status === 1);

  const handleEdit = (id: string) => {
    router.push(`/dashboard/admin/categories/sub-category/child/${id}`);
  };

  const handleToggleVisibility = () => {
    const newStatus = isVisible ? 0 : 1;
    setIsVisible(!isVisible);
    onToggleVisibility(childCategory.id, newStatus);
  };

  return (
    <StyledTableRow tabIndex={-1} role="checkbox">
      <StyledTableCell align="left" sx={{ fontWeight: 400, width: "200px" }}>
        {childCategory.name || "-"}
      </StyledTableCell>
      <StyledTableCell align="left" sx={{ fontWeight: 400, width: "100px" }}>
        {childCategory.nameCode || "-"}
      </StyledTableCell>
      <StyledTableCell align="left" sx={{ fontWeight: 400, width: "100px" }}>
        {childCategory.parent || "-"}
      </StyledTableCell>
      <StyledTableCell align="left" sx={{ fontWeight: 400, width: "100px" }}>
        {childCategory.url || "-"}
      </StyledTableCell>
      <StyledTableCell align="center" sx={{ width: "100px" }}>
        <MTSwitch
          color="info"
          checked={isVisible}
          onChange={handleToggleVisibility}
        />
      </StyledTableCell>
      <StyledTableCell align="center" sx={{ width: "100px" }}>
        <Box display="flex" justifyContent="center">
          <StyledIconButton onClick={() => handleEdit(childCategory.id)}>
            <Edit />
          </StyledIconButton>
          <StyledIconButton onClick={() => onDelete(childCategory.id)}>
            <Delete />
          </StyledIconButton>
        </Box>
      </StyledTableCell>
    </StyledTableRow>
  );
}
