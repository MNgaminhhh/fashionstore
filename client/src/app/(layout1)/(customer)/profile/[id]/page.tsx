import { cookies } from "next/headers";
import { get } from "lodash";
import EditProfileView from "../../../../../sections/customer/profile/view/EditProfileView";
import User from "../../../../../services/User";

export default async function Profile() {
  const cookieStore = cookies();
  const token = cookieStore.get("access_cookie")?.value;
  const user = await User.profile(token);
  const infoUser = get(user, "data.data", {});
  return <EditProfileView user={infoUser} />;
}
