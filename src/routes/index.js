import express from "express";
import Match from "../helper/match.js";
import { isLikelyMatch, isLikelyMatchStrings } from "../helper/likeMatch.js";
import MatchHistory from "../model/matchHistory.js";
import findApprovedMatch from './../helper/findApproveMatch.js';
const route = express.Router();

route.get("/", (req, res) => {
   res.send("Match Transactions APIs");
});
// route.post("/match", (req, res) => {
//    const { orders, transactions } = req.body;

//    const matchedRecords = orders.map((order) => {
//       const matchedTransactions = transactions.filter((txn) => Match(order, txn));
//       return [order, ...matchedTransactions];
//    });

//    res.json(matchedRecords);
// });

route.post("/match", async (req, res) => {
   const { orders, transactions } = req.body;
   if (!Array.isArray(orders)) {
      return res.status(400).json({ message: "Bad Request" });
    }
   const matchedRecords = await Promise.all(
      orders.map(async (order) => {
         const approvedMatch = await findApprovedMatch(order);
         let matchedTransaction = [];
         if (approvedMatch) {
            for (let i = 0; i < approvedMatch.length; i++) {
               const transaction = [];
               transactions.find((txn) => {
                  const orderId = isLikelyMatchStrings(txn.orderId , approvedMatch[i].transactionId);
                  const customerName = isLikelyMatchStrings(txn.customerName , approvedMatch[i].transactionCustomerName);
                  const product = isLikelyMatchStrings(txn.product , approvedMatch[i].transactionProduct);
                  const totalDistance = orderId + customerName + product;
                  totalDistance <= 5 && transaction.push(txn);
               });
               
               if (transaction !== null && transaction !== undefined && transaction.length > 0) {
                  matchedTransaction = transaction;
                  break;
               }
            }
            if (matchedTransaction.length > 0) {
               return [order, ...matchedTransaction];
            }
         }
         // Create an array to hold potential matches with their distances
         const potentialMatches = transactions.map((txn) => {
            const distances = isLikelyMatch(order, txn, true);
            return {
               transaction: txn,
               distances,
            };
         });

         // Sort potential matches based on the combined distance scores
         potentialMatches.sort((a, b) => {
            const totalDistanceA = a.distances.nameDistance + a.distances.orderIdDistance + a.distances.productDistance;
            const totalDistanceB = b.distances.nameDistance + b.distances.orderIdDistance + b.distances.productDistance;
            return totalDistanceA - totalDistanceB; // Ascending order
         });

         // Determine the best matched transactions based on lowest distance scores
         const bestMatches = potentialMatches
            .filter((match) => {
               const totalDistance = match.distances.nameDistance + match.distances.orderIdDistance + match.distances.productDistance;
               return totalDistance <= 13; // Adjust this threshold based on acceptable combined distances
            })
            .map((match) => match.transaction);
            if (bestMatches.length > 0) {
               const insertPromises = bestMatches.map(async (match) => {
                   // Save match and distances to MongoDB
                   const insertedData = await MatchHistory.create({
                       orderId: order.orderId,
                       orderCustomerName: order.customerName,
                       orderProduct: order.product,
                       transactionId: match.orderId,
                       transactionCustomerName: match.customerName,
                       transactionProduct: match.product,
                   });
                   // Assign the inserted ID to the match object
                   match._id = insertedData._id;
                   return match; // Return the updated match
               });
               await Promise.all(insertPromises);
           }
         return [order, ...bestMatches];
      })
   );

   res.json(matchedRecords);
});

route.patch("/status/:id", async (req, res) => {
   const { id } = req.params; // Get the id from the URL
   const { status } = req.body; // Get the status from the request body

   try {
       // Find the document by id and update its status
       const updatedDocument = await MatchHistory.findByIdAndUpdate(
           id,
           { status: status }, // Set the new status
           { new: true } // Return the updated document
       );

       if (!updatedDocument) {
           return res.status(404).json({ message: "Document not found" });
       }

       // Send the updated document as a response
       res.json({ message: "Status updated successfully", data: updatedDocument });
   } catch (error) {
       res.status(500).json({ message: "Server error" });
   }
});

export default route;
