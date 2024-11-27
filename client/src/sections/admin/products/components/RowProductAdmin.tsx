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
    onToggleStatus: (id: string, status: boolean) => void; // Thêm hàm này để xử lý thay đổi trạng thái "Còn hàng" / "Hết hàng"
};

export default function RowProductAdmin({ product, onDelete, onToggleApproval, onToggleStatus }: Props) {
    const router = useRouter();
    const [status, setStatus] = useState(product.status);  // Sử dụng status sản phẩm
    const [isApproved, setIsApproved] = useState(product.is_approved);  // Trạng thái duyệt

    const handleEdit = (id: string) => {
        router.push(`/admin/products/${id}`);
    };

    const handleToggleStatus = () => {
        const newStatus = !status;
        setStatus(newStatus);  // Cập nhật trạng thái
        onToggleStatus(product.id, newStatus);  // Gọi hàm từ props để thông báo trạng thái
    };

    const handleToggleApproval = () => {
        const newApprovalStatus = !isApproved;
        setIsApproved(newApprovalStatus);
        onToggleApproval(product.id, newApprovalStatus);  // Cập nhật trạng thái phê duyệt
    };

    return (
        <StyledTableRow tabIndex={-1} role="checkbox">
            <StyledTableCell align="left" sx={{ fontWeight: 400 }}>
                {product.name || "-"}
            </StyledTableCell>
            <StyledTableCell align="left" sx={{ fontWeight: 400 }}>
                {product.store_name || "-"}
            </StyledTableCell>
            <StyledTableCell align="left" sx={{ fontWeight: 400 }}>
                {product.category_name || 0}
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
                        color: status ? 'green' : 'red',
                        fontWeight: 'bold'
                    }}
                >
                    {status ? "Còn hàng" : "Hết hàng"}
                </Typography>
            </StyledTableCell>
            <StyledTableCell align="center" sx={{ fontWeight: 400 }}>
                <MTSwitch
                    color="info"
                    checked={isApproved}
                    onChange={handleToggleApproval}
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
