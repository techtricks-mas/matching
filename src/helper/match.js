const Match = (order, txn) => {
    return (
        order.customerName === txn.customerName &&
        order.orderId === txn.orderId &&
        order.date === txn.date &&
        order.product === txn.product &&
        order.price === txn.price
    );
}

export default Match;