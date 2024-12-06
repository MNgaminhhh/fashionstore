import { cookies } from "next/headers";
import { get } from "lodash";
import ProfileView from "../../../../sections/customer/profile/view/ProfileView";
import User from "../../../../services/User";

export default async function MyAddress() {
  const cookieStore = cookies();
  const token = cookieStore.get("access_cookie")?.value;
  const user = await User.profile(token);
  const infoUser = get(user, "data.data", {});
  return <ProfileView user={infoUser} />;
}
