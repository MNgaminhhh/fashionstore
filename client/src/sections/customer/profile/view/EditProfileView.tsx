"use client";

import { Fragment } from "react";
import Person from "@mui/icons-material/Person";
import Header from "../../components/Header";
import UserModel from "../../../../models/User.model";
import EditForm from "../../components/EditForm";
import { Card } from "@mui/material";

type Props = { user: UserModel };
export default function EditProfileView({ user }: Props) {
  return (
    <Fragment>
      <Header
        Icon={Person}
        title="Chỉnh sửa hồ sơ"
        buttonText="Trở Về"
        href={`/profile`}
      />
      <Card sx={{ p: 3 }}>
        <EditForm user={user} />
      </Card>
    </Fragment>
  );
}
