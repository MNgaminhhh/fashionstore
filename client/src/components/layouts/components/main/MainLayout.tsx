"use client";
import { Fragment, PropsWithChildren, useCallback, useState } from "react";
import SearchBar from "./SearchBar";
import Footer from "../../../footer/Footer";
import Header from "../../../header/Header";
import StickyBox from "../../../stickybox/StickyBox";
import Navbar from "../../../navbar";


export default function MainLayout({ children }: PropsWithChildren) {
    const [isFixed, setIsFixed] = useState(false);
    const toggleIsFixed = useCallback((fixed: boolean) => setIsFixed(fixed), []);

    return (
        <Fragment>
            <StickyBox fixedOn={0} onSticky={toggleIsFixed} scrollDistance={300}>
                <Header isFixed={isFixed} midSlot={<SearchBar />} />
            </StickyBox>
            <Navbar elevation={0} border={1} />

            {children}

            <Footer />
        </Fragment>
    );
}
