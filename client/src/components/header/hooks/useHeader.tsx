import { useState } from "react";

export default function useHeader() {
    const [isDialog, setIsDialog] = useState<boolean>(false);
    const [isSidenav, setIsSidenav] = useState<boolean>(false);
    const [isSearchBar, setIsSearchBar] = useState<boolean>(false);

    const toggleDialog = () => setIsDialog((prevState) => !prevState);
    const toggleSidenav = () => setIsSidenav((prevState) => !prevState);
    const toggleSearchBar = () => setIsSearchBar((prevState) => !prevState);

    return {
        isDialog,
        isSidenav,
        isSearchBar,
        toggleDialog,
        toggleSidenav,
        toggleSearchBar,
    };
}
