interface CouponModel {
  id: string;
  name: string;
  code: string;
  quantity: string;
  start_date: string;
  end_date: string;
  type: string;
  discount: string;
  max_price: string;
  status: string;
}
interface CouponResModel {
  ID: string;
  Field: string;
  Operator: string;
  Value: {
    price: number;
  };
  Description: string;
}
export default CouponModel;
