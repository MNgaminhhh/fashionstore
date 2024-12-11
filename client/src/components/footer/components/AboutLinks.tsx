import { Fragment } from "react";
import { Heading, StyledLink } from "../styles";

type AboutLinksProps = { isDark?: boolean };
export const ABOUT_LINKS = [
  "Cửa hàng",
  "Chúng tôi",
  "Điều khoản & Điều kiện",
  "Chính sách bảo mật",
];
export default function AboutLinks({ isDark }: AboutLinksProps) {
  return (
    <Fragment>
      <Heading>Về chúng tôi</Heading>

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
