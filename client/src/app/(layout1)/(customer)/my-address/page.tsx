import { cookies } from "next/headers";
import { get } from "lodash";
import MyAddressView from "../../../../sections/customer/myaddress/view/MyAddressView";
import Address from "../../../../services/Address";

export default async function MyAddress() {
  const cookieStore = cookies();
  const token = cookieStore.get("access_cookie")?.value;
  const address = await Address.getListAddress(token);
  const infoAddress = get(address, "data", {});
  return <MyAddressView addressList={infoAddress} />;
}
