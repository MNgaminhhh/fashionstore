"use client";

import { Fragment } from "react";
import Person from "@mui/icons-material/Person";
import Header from "../../components/Header";
import UserModel from "../../../../models/User.model";
import Analytics from "../../components/Analytics";

type Props = { user: UserModel };
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
    </Fragment>
  );
}
