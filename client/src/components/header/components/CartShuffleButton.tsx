import React from 'react';
import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';

const CustomBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
        backgroundColor: '#FF0000',
        color: 'white',
        fontSize: '0.8rem',
        borderRadius: '50%',
        padding: '4px',
        minWidth: '22px',
        height: '22px',
    },
}));

export default function NotificationButtons() {
    return (
        <Box display="flex" justifyContent="center" alignItems="center" gap={1}>
            <CustomBadge badgeContent={3}>
                <IconButton aria-label="shuffle" style={{ color: 'white' }}>
                    <ShuffleIcon style={{ fontSize: '30px' }} />
                </IconButton>
            </CustomBadge>

            <CustomBadge badgeContent={4}>
                <IconButton aria-label="shopping-bag" style={{ color: 'white' }}>
                    <ShoppingBagIcon style={{ fontSize: '30px' }} />
                </IconButton>
            </CustomBadge>
        </Box>
    );
}
