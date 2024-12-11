import { MouseEvent, useCallback, useEffect, useState } from "react";
import {StyledWrapper} from "./styles";
import CategoryList from "./components/categorylist";

type Props = { render: (handler: Function) => JSX.Element };
export default function CategoryMenu({ render }: Props) {
    const [open, setOpen] = useState(false);

    const onClick = (e: MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation();
        setOpen((open) => !open);
    };

    const handleDocumentClick = useCallback(() => setOpen(false), []);

    useEffect(() => {
        window.addEventListener("click", handleDocumentClick);
        return () => window.removeEventListener("click", handleDocumentClick);
    }, [handleDocumentClick]);

    return (
        <StyledWrapper open={open}>
            {render(onClick)}
            <CategoryList open={open} />
        </StyledWrapper>
    );
}
