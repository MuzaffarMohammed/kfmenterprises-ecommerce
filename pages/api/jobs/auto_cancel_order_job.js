import { deleteData, putData } from "../../../utils/fetchData";
import * as log from "../../../middleware/log"

export const autoCancelOrder = async (order, authToken) => {
    try {
        log.debug('autoCancelOrder...');
        log.debug('autoCancelOrder Process Start...');
        deleteData(`order/${order._id}`, authToken)
            .then(res => {
                if (res.err) throw err;
                if (res.order && !res.order.placed) {
                    log.debug('No payment done for order : ' + res.order._id);
                    revertingInStockAndSoldOfProduct(res.order);
                    log.debug('autoCancelOrder Job completed!');
                }
            });
    } catch (err) { log.error('autoCancelOrder', err) }
}

const revertingInStockAndSoldOfProduct = async (order, authToken) => {
    try {
        order.cart.map(product => {
            log.debug('Reverting Instock and Sold count for : ' + product.title)
            const sold = product.sold - product.quantity;
            const inStock = product.inStock + product.quantity;
            putData(`product/${product._id}`, { updateStockAndSold: true, sold, inStock }, authToken)
                .then(res => { if (res.err) throw err })
        })
    } catch (err) { log.error('revertingInStockAndSoldOfProduct', err) }
}