import moment from "moment";
import Link from "next/link";
import { formatDateTime } from "../../utils/util";

export const orderColumns = [
    {
        id: 'orderId',
        name: 'Order ID',
        field: '_id',
        format: {
            type: 'link',
            url: {
                uri: '/order?',
                queryParams: {
                    id: '_id'
                }
            }
        }
    },
    {
        id: 'orderDate',
        name: 'Time & Date',
        field: 'dateOfPlaced',
        format: {
            type: 'orderTimeDate'
        }
    },
    {
        id: 'orderTotal',
        name: 'Total Pay',
        field: 'total',
        format: {
            type: 'currency'
        }
    },
    {
        id: 'orderStatus',
        name: 'Status',
        field: '_id',
        format: {
            type: 'orderStatus'
        }
    },
    {
        id: 'orderDeliveryStatus',
        name: 'Delivery Status',
        field: 'dateOfPlaced',
        format: {
            type: 'orderDeliveryStatus'
        }
    }
];

export const orderTimeDateFormatter = (order) => {
    return order.placed ?
        order.dateOfPlaced && formatDateTime(order.dateOfPlaced)
        : order.createdAt && formatDateTime(order.createdAt)
}

export const orderStatusFormatter = (order, isAdmin) => {
    return (
        order.paid
            ? <label className="text-success italic-text"> Paid</label>
            : (
                <Link href={`/order?id=${order._id}`} style={{ cursor: 'pointer' }}>
                    <button className="btn btn-primary" style={{fontSize:'11px'}} data-toggle="tooltip" data-placement="bottom" title="Go to payment page">{isAdmin ? 'Go to order page' : 'Pay Now'}</button>
                </Link>
            )
    )
}

export const orderDeliveryStatusFormatter = (order) => {
    return (
        order.delivered
            ? <label className='text-success italic-text'>{order.dateOfPlaced && `Delivered  ${moment(order.dateOfPlaced).fromNow()}`}</label>
            :
            order.accepted
                ? <label className='italic-text' style={{ color: '#faa200' }}>In Transit</label>
                : <label className='italic-text'>Awaiting Confirmation</label>

    )
}
