import { cookies } from "next/headers";
import { get } from "lodash";
import ShippingRuleView from "../../../../sections/admin/shipping-rule/view/ShippingRuleView";
import ShippingRule from "../../../../services/ShippingRule";

export default async function ShippingRulePage() {
  const cookieStore = cookies();
  const token = cookieStore.get("access_cookie")?.value;
  const ship = await ShippingRule.getAllShippingRule(token);
  const infoShip = get(ship, "data", {});
  return <ShippingRuleView shippingRulesData={infoShip} token={token} />;
}
