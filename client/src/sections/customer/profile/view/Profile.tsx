"use client";

import { Fragment } from "react";
import Person from "@mui/icons-material/Person";
import Header from "../../components/Header";

export default function ProfilePageView() {
    return (
        <Fragment>
            <Header
                Icon={Person}
                title="Hồ sơ của tôi"
                buttonText="Chỉnh sửa hồ sơ"
                href={`/profile`}
            />
        </Fragment>
    );
}
