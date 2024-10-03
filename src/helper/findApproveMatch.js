import MatchHistory from "../model/matchHistory.js";

const findApprovedMatch = async (order) => {
    return await MatchHistory.find({ orderId: order.orderId, orderCustomerName: order.customerName, orderProduct: order.product, status: true });
 };

 export default findApprovedMatch