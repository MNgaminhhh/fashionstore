import { Fragment } from "react";
import Link from "next/link";
import MTImage from "../../MTImage";
export default function LogoSection() {
    return (
        <Fragment>
            <Link href="/">
                <MTImage mb={2.5} src="/assets/images/logo.svg" alt="logo" width={150} height={50} />
            </Link>
        </Fragment>
    );
}
