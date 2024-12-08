import currencyJs from "currency.js";
import { formatDistanceStrict } from "date-fns";

function getDateDifference(date: string | number | Date): string {
  const distance = formatDistanceStrict(new Date(), new Date(date));
  return distance + " ago";
}

function renderProductCount(
  page: number,
  perPageProduct: number,
  totalProduct: number
): string {
  let startNumber = (page - 1) * perPageProduct + 1; // Thêm 1 để không có chỉ số 0
  let endNumber = page * perPageProduct;

  if (endNumber > totalProduct) {
    endNumber = totalProduct;
  }
  return `Showing ${startNumber}-${endNumber} of ${totalProduct} products`;
}

function calculateDiscount(price: number, discount: number): string {
  const afterDiscount = Number((price - price * (discount / 100)).toFixed(2));
  return formatCurrency(afterDiscount);
}
function formatCurrency(price: number, fraction: number = 0): string {
  const formatCurrency = currencyJs(price, {
    symbol: "",
    separator: ",",
    decimal: ".",
    precision: fraction,
  }).format();
  return `${formatCurrency} VNĐ`;
}

export {
  formatCurrency,
  getDateDifference,
  calculateDiscount,
  renderProductCount,
};
