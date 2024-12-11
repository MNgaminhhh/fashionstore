"use client";

import {FlexBox} from "../../flexbox";
import {StyledIconButton} from "../styles";
import Facebook from "../../../icons/social/Facebook";
import Youtube from "../../../icons/social/Youtube";
import Google from "../../../icons/social/Googe";
import Instagram from "../../../icons/social/Instagram";

//faker data
export const SOCIAL_ICON_LINKS = [
    { Icon: Facebook, url: "https://www.facebook.com/" },
    { Icon: Youtube, url: "https://www.youtube.com/" },
    { Icon: Google, url: "https://www.google.com/" },
    { Icon: Instagram, url: "https://www.instagram.com/" },
];

type Props = { variant?: "light" | "dark" };
export default function SocialLinks({ variant = "light" }: Props) {
    const getColorForSocialMedia = (url: string): string => {
        if (url.includes("facebook")) return "#4267B2";
        if (url.includes("instagram")) return "#E1306C";
        if (url.includes("youtube")) return "#FF0000";
        return "#bdbdbd";
    };

    return (
        <FlexBox className="flex">
            {SOCIAL_ICON_LINKS.map(({ Icon, url }, index) => (
                <a href={url} target="_blank" rel="noreferrer noopener" key={index}>
                    <StyledIconButton
                        variant={variant}
                        backgroundColor={getColorForSocialMedia(url)}
                    >
                        <Icon fontSize="inherit" className="icon" />
                    </StyledIconButton>
                </a>
            ))}
        </FlexBox>
    );
}
