import LogoutView from "../../../../sections/auth/view/LogoutView";
import { cookies } from "next/headers";

export default async function LogoutPage() {
  return <LogoutView />;
}
