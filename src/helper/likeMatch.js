import levenshtein from "js-levenshtein";

const isLikelyMatch = (order, transaction) => {
   const normalizeString = (str) => str.toLowerCase().replace(/[^a-z0-9]/g, "");
   const nameDistance = levenshtein(normalizeString(order.customerName), normalizeString(transaction.customerName));
   const orderIdDistance = levenshtein(normalizeString(order.orderId), normalizeString(transaction.orderId));
   const productDistance = levenshtein(normalizeString(order.product), normalizeString(transaction.product));

   return {
      nameDistance,
      orderIdDistance,
      productDistance,
   };
};

export { isLikelyMatch };
