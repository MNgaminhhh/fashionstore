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
  totalUsed: any;
  endDate: any;
  startDate: any;
  Description: any;
  Value: any;
  Operator: any;
  Field: any;
  ID: any;
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
