import Edit from "@mui/icons-material/Edit";
import Delete from "@mui/icons-material/Delete";
import {
  StyledIconButton,
  StyledTableCell,
  StyledTableRow,
} from "../../../styles";
import { useRouter } from "next/navigation";

type Props = {
  vendor: {
    store_name: string;
    full_name: string;
    address: string;
    description: string;
    status: string;
    id: string;
  };
  tableHeading: {
    id: string;
    label: string;
    align: "left" | "center" | "right";
  }[];
  onDelete: (id: string) => void;
};

export default function RowVendors({ vendor, tableHeading, onDelete }: Props) {
  const router = useRouter();
  const statusLabel =
    {
      accepted: "Hoạt động",
      pending: "Đang chờ duyệt",
      rejected: "Bị từ chối",
      null: "-",
    }[vendor.status as keyof typeof statusLabel] || "-";
  const handleEdit = (id: string) => {
    router.push(`/admin/vendors/${id}`);
  };

  return (
    <StyledTableRow tabIndex={-1} role="checkbox">
      <StyledTableCell align="left" sx={{ fontWeight: 400 }}>
        {vendor.store_name || "-"}
      </StyledTableCell>
      <StyledTableCell align="left" sx={{ fontWeight: 400 }}>
        {vendor.full_name || "-"}
      </StyledTableCell>
      <StyledTableCell align="left" sx={{ fontWeight: 400 }}>
        {vendor.address || "-"}
      </StyledTableCell>
      <StyledTableCell align="left" sx={{ fontWeight: 400 }}>
        {vendor.description && vendor.description.length > 140
          ? `${vendor.description.slice(0, 140)}...`
          : vendor.description || "-"}
      </StyledTableCell>
      <StyledTableCell align="left" sx={{ fontWeight: 700 }}>
        {statusLabel}
      </StyledTableCell>
      <StyledTableCell align="center" sx={{ minWidth: 110 }}>
        <StyledIconButton onClick={() => handleEdit(vendor.id)}>
          <Edit />
        </StyledIconButton>
        <StyledIconButton onClick={() => onDelete(vendor.id)}>
          <Delete />
        </StyledIconButton>
      </StyledTableCell>
    </StyledTableRow>
  );
}
