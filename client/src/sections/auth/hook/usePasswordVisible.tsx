import { useCallback, useState } from "react";

export default function usePasswordVisible() {
    const [visible, setVisible] = useState(false);

    const toggleVisible = useCallback(() => {
        setVisible((visible) => !visible);
    }, []);

    return { visible, toggleVisible };
}
