import React from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  StyledIconButton,
  StyledTableCell,
  StyledTableRow,
} from "../../../styles";
import { useRouter } from "next/navigation";
import { Box, Tooltip } from "@mui/material";
import MTSwitch from "../../../../components/MTSwitch";
import ShippingRuleModel from "../../../../models/ShippingRule.model";

type Props = {
  shippingRule: ShippingRuleModel;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, status: boolean) => void;
};

const RowShippingRule: React.FC<Props> = ({
  shippingRule,
  onDelete,
  onToggleStatus,
}) => {
  const router = useRouter();

  const handleEdit = (id: string) => {
    router.push(`/dashboard/admin/shipping-rule/${id}`);
  };

  const handleDelete = (id: string) => {
    onDelete(id);
  };

  const handleToggleStatus = (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    onToggleStatus(shippingRule.id, checked);
  };

  return (
    <StyledTableRow tabIndex={-1} role="checkbox">
      <StyledTableCell align="left" sx={{ fontWeight: 400, color: "#333" }}>
        {shippingRule.name || "-"}
      </StyledTableCell>
      <StyledTableCell align="left" sx={{ fontWeight: 400, color: "#333" }}>
        {shippingRule.min_order_cost || "-"}
      </StyledTableCell>
      <StyledTableCell align="left" sx={{ fontWeight: 400, color: "#333" }}>
        {shippingRule.price || "-"}
      </StyledTableCell>
      <StyledTableCell align="left" sx={{ fontWeight: 400, color: "#333" }}>
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
            checked={shippingRule.status}
            onChange={handleToggleStatus}
          />
        </Box>
      </StyledTableCell>
      <StyledTableCell align="center" sx={{ minWidth: 150 }}>
        <Tooltip title="Chỉnh sửa" arrow>
          <StyledIconButton onClick={() => handleEdit(shippingRule.id)}>
            <EditIcon sx={{ color: "#1976d2" }} />
          </StyledIconButton>
        </Tooltip>
        <Tooltip title="Xoá" arrow>
          <StyledIconButton onClick={() => handleDelete(shippingRule.id)}>
            <DeleteIcon sx={{ color: "#d32f2f" }} />
          </StyledIconButton>
        </Tooltip>
      </StyledTableCell>
    </StyledTableRow>
  );
};

export default RowShippingRule;
