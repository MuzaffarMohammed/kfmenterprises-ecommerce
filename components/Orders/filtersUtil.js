import moment from "moment";
import { ALL, ACCEPTED, DELIVERED, IN_TRANSIT, REJECTED, TODAY, YET_TO_DISPATCH, RETURNED } from "../../utils/constants";

export const applyFilter = (filterType, orders, isUser) => {
    switch (filterType) {
        case RETURNED:
            return getReturnedOrders(orders);
        case YET_TO_DISPATCH:
            return getYetToDispatchOrders(orders);
        case ACCEPTED:
            return getAcceptedOrders(orders);
        case REJECTED:
            return getRejectedOrders(orders);
        case IN_TRANSIT:
            return getInTransitOrders(orders);
        case DELIVERED:
            return getDeliveredOrders(orders);
        case ALL:
            return getAllPlacedOrders(orders, isUser);
    }
}

export const getAllFiltersLengths = (orders, isUser) => {
    return {
        'RETURNED': getReturnedOrders(orders).length,
        'YET_TO_DISPATCH': getYetToDispatchOrders(orders).length,
        'ACCEPTED': getAcceptedOrders(orders).length,
        'REJECTED': getRejectedOrders(orders).length,
        'IN_TRANSIT': getInTransitOrders(orders).length,
        'DELIVERED': getDeliveredOrders(orders).length,
        'ALL': getAllPlacedOrders(orders, isUser).length
    }
}

const getAllPlacedOrders = (orders, isUser) => {
    return isUser ? orders : orders.filter(order => order.placed);
}

const getReturnedOrders = (orders) => {
    //Yet to implement this..
    return orders.filter(order => order.returned);
}

const getYetToDispatchOrders = (orders) => {
    return orders.filter(order => yetToDispatchOrder(order));
}

const getAcceptedOrders = (orders) => {
    return orders.filter(order => inTransitOrder(order));
}

const getRejectedOrders = (orders) => {
    //Yet to implement this..
    return orders.filter(order => order.rejected);
}

const getInTransitOrders = (orders) => {
    return orders.filter(order => inTransitOrder(order));
}

const getDeliveredOrders = (orders) => {
    return orders.filter(order => order.delivered);
}

const inTransitOrder = (order) => {
    return order.accepted && !order.delivered;
}

const deliveredOrder = (order) => {
    return order.delivered;
}

const yetToDispatchOrder = (order) => {
    return order.placed && !order.accepted && !order.delivered;
}

export const classNameOnHover = (order) => {

    if (inTransitOrder(order)) return 'order-transit-row';
    if (deliveredOrder(order)) return 'order-delivered-row';
    if (yetToDispatchOrder(order)) return 'order-yet-to-dispatch-row';

    return 'order-row';
}