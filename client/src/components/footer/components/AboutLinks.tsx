import { Fragment } from "react";
import { Heading, StyledLink } from "../styles";

type AboutLinksProps = { isDark?: boolean };
export const ABOUT_LINKS = [
    "Careers",
    "Our Stores",
    "Our Cares",
    "Terms & Conditions",
    "Privacy Policy"
];
export default function AboutLinks({ isDark }: AboutLinksProps) {
    return (
        <Fragment>
            <Heading>About Us</Heading>

            <div>
                {ABOUT_LINKS.map((item, ind) => (
                    <StyledLink isDark={isDark} href="/" key={ind}>
                        {item}
                    </StyledLink>
                ))}
            </div>
        </Fragment>
    );
}
