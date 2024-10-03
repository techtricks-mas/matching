import levenshtein from "js-levenshtein";

const normalizeString = (str) => str.toLowerCase().replace(/[^a-z0-9]/g, "");
const isLikelyMatch = (order, transaction) => {
   const nameDistance = levenshtein(normalizeString(order.customerName), normalizeString(transaction.customerName));
   const orderIdDistance = levenshtein(normalizeString(order.orderId), normalizeString(transaction.orderId));
   const productDistance = levenshtein(normalizeString(order.product), normalizeString(transaction.product));
   const priceCheck = order.price === transaction.price
   const dateCheck = order.date === transaction.date
   if (priceCheck && dateCheck) {
      return {
         nameDistance,
         orderIdDistance,
         productDistance,
      };
   }
   return {}
};
const isLikelyMatchStrings = (oldStr, newStr) => {
   return levenshtein(normalizeString(oldStr), normalizeString(newStr));
};

export { isLikelyMatch, isLikelyMatchStrings };
