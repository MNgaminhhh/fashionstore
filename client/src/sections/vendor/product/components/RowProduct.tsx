import React, { useState } from 'react';
import Edit from "@mui/icons-material/Edit";
import Delete from "@mui/icons-material/Delete";
import {
    StyledIconButton,
    StyledTableCell,
    StyledTableRow,
} from "../../../styles";
import { useRouter } from "next/navigation";
import MTSwitch from "../../../../components/MTSwitch";
import { Typography, Box } from "@mui/material";
import ProductModel from "../../../../models/Product.model";

type Props = {
    product: ProductModel;
    onDelete: (id: string) => void;
    onToggleApproval: (id: string, isApproved: boolean) => void;
};

export default function RowProduct({ product, onDelete, onToggleApproval }: Props) {
    const router = useRouter();
    const [status, setStatus] = useState(product.status);

    const handleEdit = (id: string) => {
        router.push(`/admin/products/${id}`);
    };

    const handleToggleStatus = () => {
        const newStatus = !status;
        setIsApproved(newStatus);
        onToggleApproval(product.id, newStatus);
    };

    return (
        <StyledTableRow tabIndex={-1} role="checkbox">
            <StyledTableCell align="left" sx={{ fontWeight: 400 }}>
                {product.name || "-"}
            </StyledTableCell>
            <StyledTableCell align="left" sx={{ fontWeight: 400 }}>
                {product.sku || "-"}
            </StyledTableCell>
            <StyledTableCell align="left" sx={{ fontWeight: 400 }}>
                {product.qty || 0}
            </StyledTableCell>
            <StyledTableCell align="left" sx={{ fontWeight: 400 }}>
                {product.price || "-"}
            </StyledTableCell>
            <StyledTableCell align="left" sx={{ fontWeight: 400 }}>
                {product.product_type || "-"}
            </StyledTableCell>
            <StyledTableCell align="center" sx={{ fontWeight: 400 }}>
                <Typography
                    variant="body2"
                    sx={{
                        color: product.is_approved ? 'green' : 'red',
                        fontWeight: 'bold'
                    }}
                >
                    {product.is_approved ? "Đã duyệt" : "Chưa duyệt"}
                </Typography>
            </StyledTableCell>
            <StyledTableCell align="center" sx={{ fontWeight: 400 }}>
                <MTSwitch
                    color="info"
                    checked={status}
                    onChange={handleToggleStatus}
                />
            </StyledTableCell>
            <StyledTableCell align="center" sx={{ minWidth: 110 }}>
                <StyledIconButton onClick={() => handleEdit(product.id)}>
                    <Edit />
                </StyledIconButton>
                <StyledIconButton onClick={() => onDelete(product.id)}>
                    <Delete />
                </StyledIconButton>
            </StyledTableCell>
        </StyledTableRow>
    );
}
