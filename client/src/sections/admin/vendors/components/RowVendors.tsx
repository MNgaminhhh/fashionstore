import Edit from "@mui/icons-material/Edit";
import Delete from "@mui/icons-material/Delete";
import {
  StyledIconButton,
  StyledTableCell,
  StyledTableRow,
} from "../../../styles";
type Props = {
  vendor: any;
  tableHeading: {
    id: string;
    label: string;
    align: "left" | "center" | "right";
  }[];
};

export default function RowVendors({ vendor, tableHeading }: Props) {
  const filteredTableHeading = tableHeading.filter(
    (headCell) => headCell.id !== "action"
  );

  return (
    <StyledTableRow tabIndex={-1} role="checkbox">
      {filteredTableHeading.map((headCell) => {
        const value = vendor[headCell.id] || "-";
        const displayValue =
          headCell.id === "description" && typeof value === "string"
            ? value.length > 200
              ? `${value.slice(0, 200)}...`
              : value
            : value;

        return (
          <StyledTableCell
            key={headCell.id}
            align={headCell.align}
            sx={{ fontWeight: 400 }}
          >
            {displayValue}
          </StyledTableCell>
        );
      })}
      <StyledTableCell align="center" sx={{ minWidth: 110 }}>
        <StyledIconButton>
          <Edit />
        </StyledIconButton>

        <StyledIconButton>
          <Delete />
        </StyledIconButton>
      </StyledTableCell>
    </StyledTableRow>
  );
}
