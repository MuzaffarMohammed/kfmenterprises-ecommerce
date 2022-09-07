
import moment from 'moment';
import Link from 'next/link';
import { formatDateTime } from '../../utils/util';
import { classNameOnHover } from './filtersUtil';

export default function OrdersGrid(props) {


    const Orders = () => {
        return (
            props.orders && props.orders.map(order => (
                <tr key={order._id} className={classNameOnHover(order)}>
                    <td className="p-2">
                        <Link href={`/order?id=${order._id}`} style={{ cursor: 'pointer' }}>
                            <a>{order._id}</a>
                        </Link>
                    </td>
                    <td className="p-2">
                        {order.placed ?
                            order.dateOfPlaced && formatDateTime(order.dateOfPlaced)
                            : order.createdAt && formatDateTime(order.createdAt)}
                    </td>
                    <td className="p-2">₹{order.total}</td>

                    <td className="p-2">
                        {
                            order.paid
                                ? <label className="text-success italic-text"> Paid</label>
                                : (
                                    <Link href={`/order?id=${order._id}`} style={{ cursor: 'pointer' }}>
                                        <button className="btn btn-primary" data-toggle="tooltip" data-placement="bottom" title="Go to payment page">{props.isAdmin ? 'Go to order page' : 'Pay Now'}</button>
                                    </Link>
                                )
                        }
                    </td>

                    <td className="p-2">
                        {
                            order.delivered
                                ? <label className='text-success italic-text'>{order.dateOfPlaced && `Delivered  ${moment(order.dateOfPlaced).fromNow()}`}</label>
                                :
                                order.accepted
                                    ? <label className='italic-text' style={{ color: '#faa200' }}>In Transit</label>
                                    : <label className='italic-text'>Awaiting Confirmation</label>
                        }
                    </td>
                </tr>
            ))
        );
    }

    return (
        <>
            <table className="table-bordered table-hover w-100" style={{ minWidth: '600px' }}>
                <thead className="font-weight-bold app-bg-color" style={{ color: 'white', fontSize: '0.9rem' }}>
                    <tr>
                        <td className="p-2">Order ID</td>
                        <td className="p-2">Time & Date</td>
                        <td className="p-2">Total Pay</td>
                        <td className="p-2">Status</td>
                        <td className="p-2">Delivery Status</td>
                    </tr>
                </thead>
                <tbody>{(props.orders && props.orders.length > 0) && (Orders())}</tbody>
            </table>
            {
                props.orders && props.orders.length === 0 && (
                    <div className="no-data-card"><label className='italic-text'>Whoops! No orders to display.</label></div>
                )
            }
        </>
    );
}