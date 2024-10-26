"use client";

import { Fragment } from "react";
import Person from "@mui/icons-material/Person";
import Header from "../../components/Header";
import User from "../../../../models/User.model";
import Analytics from "../../components/Analytics";
import InfoUser from "../../components/InforUser";

type Props = { user: User };
export default function ProfileView({ user }: Props) {
  return (
    <Fragment>
      <Header
        Icon={Person}
        title="Hồ sơ của tôi"
        buttonText="Chỉnh sửa hồ sơ"
        href={`/profile/${user.id}`}
      />
      <Analytics user={user} />
      <InfoUser user={user} />
    </Fragment>
  );
}
