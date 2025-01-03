import Edit from "@mui/icons-material/Edit";
import Delete from "@mui/icons-material/Delete";
import {
  StyledIconButton,
  StyledTableCell,
  StyledTableRow,
} from "../../../styles";
import { useRouter } from "next/navigation";
import { Avatar, Tooltip } from "@mui/material";
import MTSwitch from "../../../../components/MTSwitch";
import { useState } from "react";

type Props = {
  brand: {
    sequence: string;
    name: string;
    image: string;
    visible: string;
    id: string;
  };
  onDelete: (id: string) => void;
  onToggleVisibility: (id: string, visible: boolean) => void;
};

export default function RowBrands({
  brand,
  onDelete,
  onToggleVisibility,
}: Props) {
  const router = useRouter();

  const [isVisible, setIsVisible] = useState<any>(brand.visible);

  const handleEdit = (id: string) => {
    router.push(`/dashboard/admin/brands/${id}`);
  };

  const handleToggleVisibility = () => {
    const newVisibility = !isVisible;
    setIsVisible(newVisibility);
    onToggleVisibility(brand.id, newVisibility);
  };

  return (
    <StyledTableRow tabIndex={-1} role="checkbox">
      <StyledTableCell align="left" sx={{ fontWeight: 400 }}>
        {brand.sequence || "-"}
      </StyledTableCell>
      <StyledTableCell align="left" sx={{ fontWeight: 400 }}>
        <Avatar
          alt={brand.name}
          src={brand.image}
          sx={{
            borderRadius: 2,
            width: 60,
            height: 60,
          }}
        />
      </StyledTableCell>
      <StyledTableCell align="left" sx={{ fontWeight: 400 }}>
        {brand.name || "-"}
      </StyledTableCell>
      <StyledTableCell align="left" sx={{ fontWeight: 700 }}>
        <MTSwitch
          color="info"
          checked={isVisible}
          onChange={handleToggleVisibility}
        />
      </StyledTableCell>
      <StyledTableCell align="center" sx={{ minWidth: 110 }}>
        <Tooltip title="Chỉnh sửa" arrow>
          <StyledIconButton onClick={() => handleEdit(brand.id)}>
            <Edit sx={{ color: "#1976d2" }} />
          </StyledIconButton>
        </Tooltip>
        <Tooltip title="Xoá" arrow>
          <StyledIconButton onClick={() => onDelete(brand.id)}>
            <Delete sx={{ color: "#d32f2f" }} />
          </StyledIconButton>
        </Tooltip>
      </StyledTableCell>
    </StyledTableRow>
  );
}
