import Edit from "@mui/icons-material/Edit";
import Delete from "@mui/icons-material/Delete";
import {
  StyledIconButton,
  StyledTableCell,
  StyledTableRow,
} from "../../../styles";
import { useRouter } from "next/navigation";
import { Avatar } from "@mui/material";
import MTSwitch from "../../../../components/MTSwitch";
import { useState } from "react";
import BannerModel from "../../../../models/Banner.model";

type Props = {
  banner: BannerModel;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, status: boolean) => void;
};

export default function RowBanner({ banner, onDelete, onToggleStatus }: Props) {
  const router = useRouter();
  const [isStatus, setIsStatus] = useState(banner.status);

  const handleEdit = (id: string) => {
    router.push(`/dashboard/admin/banners/${id}`);
  };

  const handleToggleStatus = () => {
    const newStatus = !isStatus;
    setIsStatus(newStatus);
    onToggleStatus(banner.id, newStatus);
  };

  return (
    <StyledTableRow tabIndex={-1} role="checkbox">
      <StyledTableCell align="left" sx={{ fontWeight: 400 }}>
        {banner.serial || "-"}
      </StyledTableCell>
      <StyledTableCell align="left" sx={{ fontWeight: 400 }}>
        <Avatar
          alt={banner.title}
          src={banner.banner_image}
          sx={{
            borderRadius: 2,
            width: 60,
            height: 60,
          }}
        />
      </StyledTableCell>
      <StyledTableCell align="left" sx={{ fontWeight: 400 }}>
        {banner.title || "-"}
      </StyledTableCell>
      <StyledTableCell align="left" sx={{ fontWeight: 400 }}>
        {banner.description
          ? banner.description.length > 200
            ? `${banner.description.substring(0, 200)}...`
            : banner.description
          : "-"}
      </StyledTableCell>

      <StyledTableCell align="left" sx={{ fontWeight: 400 }}>
        {banner.button_text || "-"}
      </StyledTableCell>
      <StyledTableCell align="left" sx={{ fontWeight: 400 }}>
        {banner.button_link || "-"}
      </StyledTableCell>
      <StyledTableCell align="left" sx={{ fontWeight: 700 }}>
        <MTSwitch
          color="info"
          checked={isStatus}
          onChange={handleToggleStatus}
        />
      </StyledTableCell>
      <StyledTableCell align="center" sx={{ minWidth: 110 }}>
        <StyledIconButton onClick={() => handleEdit(banner.id)}>
          <Edit />
        </StyledIconButton>
        <StyledIconButton onClick={() => onDelete(banner.id)}>
          <Delete />
        </StyledIconButton>
      </StyledTableCell>
    </StyledTableRow>
  );
}
