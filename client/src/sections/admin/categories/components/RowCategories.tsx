import Edit from "@mui/icons-material/Edit";
import Delete from "@mui/icons-material/Delete";
import * as Icons from "react-icons/fa";
import {
  StyledIconButton,
  StyledTableCell,
  StyledTableRow,
} from "../../../styles";
import { useRouter } from "next/navigation";
import MTSwitch from "../../../../components/MTSwitch";
import { useState } from "react";

type Props = {
  category: {
    id: string;
    name: string;
    nameCode: string;
    url: string;
    status: string;
    icon: string;
  };
  onDelete: (id: string) => void;
  onToggleVisibility: (id: string, status: boolean) => void;
};

export default function RowCategories({
  category,
  onDelete,
  onToggleVisibility,
}: Props) {
  const router = useRouter();

  const [isVisible, setIsVisible] = useState(category.status === 1);

  const handleEdit = (id: string) => {
    router.push(`/dashboard/admin/categories/${id}`);
  };

  const handleToggleVisibility = () => {
    const newStatus = !isVisible;
    setIsVisible(newStatus);
    onToggleVisibility(category.id, newStatus);
  };

  const IconComponent =
    Icons[category.icon as keyof typeof Icons] || Icons.FaQuestion;

  return (
    <StyledTableRow tabIndex={-1} role="checkbox">
      <StyledTableCell align="left" sx={{ fontWeight: 400 }}>
        {category.name || "-"}
      </StyledTableCell>
      <StyledTableCell align="left" sx={{ fontWeight: 400 }}>
        {category.nameCode || "-"}
      </StyledTableCell>
      <StyledTableCell align="left" sx={{ fontWeight: 400 }}>
        {category.url || "-"}
      </StyledTableCell>
      <StyledTableCell align="left" sx={{ fontWeight: 400 }}>
        {IconComponent && <IconComponent size={24} />}
      </StyledTableCell>
      <StyledTableCell align="center" sx={{ fontWeight: 700 }}>
        <MTSwitch
          color="info"
          checked={isVisible}
          onChange={handleToggleVisibility}
        />
      </StyledTableCell>
      <StyledTableCell align="center" sx={{ minWidth: 110 }}>
        <StyledIconButton onClick={() => handleEdit(category.id)}>
          <Edit />
        </StyledIconButton>
        <StyledIconButton onClick={() => onDelete(category.id)}>
          <Delete />
        </StyledIconButton>
      </StyledTableCell>
    </StyledTableRow>
  );
}
