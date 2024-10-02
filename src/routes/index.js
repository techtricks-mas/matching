import express from "express";
import Match from "../helper/match.js";
import { isLikelyMatch } from "../helper/likeMatch.js";
const route = express.Router();

route.get("/", (req, res) => {
   res.send("Match Transactions APIs");
});
route.post("/match", (req, res) => {
   const { orders, transactions } = req.body;

   const matchedRecords = orders.map((order) => {
      const matchedTransactions = transactions.filter((txn) => Match(order, txn));
      return [order, ...matchedTransactions];
   });

   res.json(matchedRecords);
});

route.post("/match", (req, res) => {
   const { orders, transactions } = req.body;

   const matchedRecords = orders.map((order) => {
      const matchedTransactions = transactions.filter((txn) => Match(order, txn));
      return [order, ...matchedTransactions];
   });

   res.json(matchedRecords);
});

route.post("/likematch", (req, res) => {
   const { orders, transactions } = req.body;

   const matchedRecords = orders.map(order => {
      // Create an array to hold potential matches with their distances
      const potentialMatches = transactions.map(txn => {
        const distances = isLikelyMatch(order, txn);
        return {
          transaction: txn,
          distances
        };
      });
      
      // Sort potential matches based on the combined distance scores
      potentialMatches.sort((a, b) => {
        const totalDistanceA = a.distances.nameDistance + a.distances.orderIdDistance + a.distances.productDistance;
        const totalDistanceB = b.distances.nameDistance + b.distances.orderIdDistance + b.distances.productDistance;
        return totalDistanceA - totalDistanceB; // Ascending order
      });
  
      // Determine the best matched transactions based on lowest distance scores
      const bestMatches = potentialMatches.filter(match => {
        const totalDistance = match.distances.nameDistance + match.distances.orderIdDistance + match.distances.productDistance;
        console.log(totalDistance);
        
        return totalDistance <= 13; // Adjust this threshold based on acceptable combined distances
      }).map(match => match.transaction);
  
      return [order, ...bestMatches];
    });
  
    res.json(matchedRecords);
});

export default route;

// "orders": [
//     {"type": "order", "customerName": "Bryan", "orderId": "12OB-1", "date": "2023-07-11", "product": "Product ABC-1", "price": 1.23},
//     {"type": "order", "customerName": "Bryan", "orderId": "12OB-I", "date": "2023-07-11", "product": "Product ABC-1", "price": 1.23},
//     {"type": "order", "customerName": "Michael", "orderId": "L2OB-I", "date": "2023-07-11", "product": "Product ABC-1", "price": 1.23}
//   ],
//   "transactions": [
//     {"type": "txn", "customerName": "Brian", "orderId": "I208-L", "date": "2023-07-11", "product": "ABC Product v1", "price": 1.23, "transactiontype": "paymentReceived", "transactionDate": "2023-07-12", "transactionAmount": 1.23}
//   ]