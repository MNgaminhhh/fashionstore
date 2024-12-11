import { cookies } from "next/headers";
import { get } from "lodash";
import { IdParams } from "../../../../../models/Common.model";
import AddressDetailsPageView from "../../../../../sections/customer/myaddress/view/MyAddressDetailView";
import Address from "../../../../../services/Address";

export default async function Profile({ params }: IdParams) {
  const cookieStore = cookies();
  const token = cookieStore.get("access_cookie")?.value;
  const address = await Address.findOne(params.id, token);
  const infoAddress = get(address, "data.data", {});
  return <AddressDetailsPageView address={infoAddress} />;
}
