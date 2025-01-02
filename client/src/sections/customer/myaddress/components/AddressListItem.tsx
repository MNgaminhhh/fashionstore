import Link from "next/link";
import IconButton from "@mui/material/IconButton";
import Edit from "@mui/icons-material/Edit";
import Delete from "@mui/icons-material/Delete";
import AddressModel from "../../../../models/Address.model";
import { TableRow } from "../../styles";
import { Paragraph } from "../../../../components/Typography";
import { useRouter } from "next/navigation";

interface Props {
  addressData: AddressModel;
  handleDelete: (id: string) => void;
}

export default function AddressListItem({ addressData, handleDelete }: Props) {
  const router = useRouter();
  const { address, email, phone_number, receiver_name, id } = addressData || {};
  const handleEdit = (id: string) => {
    router.push(`/my-address/${id}`);
  };
  return (
    <TableRow>
      <Paragraph ellipsis>{address}</Paragraph>
      <Paragraph ellipsis>{receiver_name}</Paragraph>
      <Paragraph ellipsis>
        {phone_number} - {email}
      </Paragraph>
      <Paragraph color="grey.600">
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            handleEdit(id);
          }}
        >
          <Edit fontSize="small" color="inherit" />
        </IconButton>

        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            handleDelete(id);
          }}
        >
          <Delete fontSize="small" color="inherit" />
        </IconButton>
      </Paragraph>
    </TableRow>
  );
}
