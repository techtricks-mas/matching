import mongoose from 'mongoose';

const matchSchema = new mongoose.Schema({
   orderId: String,
   orderCustomerName: String,
   orderProduct: String,
   transactionId: String,
   transactionCustomerName: String,
   transactionProduct: String,
   status: {type: Boolean, default: false},
   createdAt: { type: Date, default: Date.now },
   updatedAt: { type: Date, default: Date.now },
});

// Model for Match History
const MatchHistory = mongoose.model('MatchHistory', matchSchema);

export default MatchHistory;
