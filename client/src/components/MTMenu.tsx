import { Menu, MenuProps } from "@mui/material";
import {Children, cloneElement, FC, Fragment, ReactElement, ReactNode, useState} from "react";

interface MTMenuProps extends MenuProps {
    open?: boolean;
    handler: ReactElement;
    children: ReactNode;
    direction?: "left" | "right" | "center";
    shouldCloseOnItemClick?: boolean;
}

const MTMenu: FC<MTMenuProps> = ({
                                           open,
                                           handler,
                                           children,
                                           direction = "left",
                                           shouldCloseOnItemClick = true,
                                           ...props
                                       }) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);

    const handleClose = () => setAnchorEl(null);

    const handleMenuItemClick = (customOnClick?: () => void) => () => {
        if (customOnClick) customOnClick();
        if (shouldCloseOnItemClick) handleClose();
    };

    return (
        <Fragment>
            {handler &&
                cloneElement(handler, {
                    onClick: handler.props.onClick || handleClick,
                })}
            <Menu
                anchorEl={anchorEl}
                onClose={handleClose}
                open={open !== undefined ? open : !!anchorEl}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: direction,
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: direction,
                }}
                {...props}
            >
                {Children.map(children, (child) =>
                    cloneElement(child as ReactElement, {
                        onClick: handleMenuItemClick(child.props.onClick),
                    })
                )}
            </Menu>
        </Fragment>
    );
};

export default MTMenu;
