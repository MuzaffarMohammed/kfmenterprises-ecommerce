
import moment from 'moment';
import Link from 'next/link';
import { classNameOnHover, inTransitOrder } from './filtersUtil';

export default function OrdersGrid(props) {

    const Orders = () => {
        return (
            props.orders.map(order => (
                <tr key={order._id} className={classNameOnHover(order)}>
                    <td className="p-2">
                        <Link href={`/order/${order._id}`} style={{ cursor: 'pointer' }}>
                            <a>{order._id}</a>
                        </Link>
                    </td>
                    <td className="p-2">
                        {order.placed ? 
                        order.dateOfPlaced && moment(order.dateOfPlaced).format("LT, ll")
                        :order.createdAt && moment(order.createdAt).format("LT, ll")}
                    </td>
                    <td className="p-2">₹{order.total}</td>
                    {props.isAdmin && (
                        <td className="p-2">
                            {
                                order.paid
                                    ? <i className="fas fa-check text-success"></i>
                                    : <i className="fas fa-times text-danger"></i>
                            }
                        </td>
                    )}
                    <td className="p-2">
                        {
                            order.delivered
                                ? <label className='text-success italic-text'>{order.dateOfPlaced && `Delivered  ${moment(order.dateOfPlaced).fromNow()}`}</label>
                                :
                                order.accepted
                                    ? <label className='italic-text' style={{ color: '#faa200' }}>In Transit</label>
                                    : <label className='italic-text'>Not Yet Dispatch</label>
                        }
                    </td>
                </tr>
            ))
        );
    }

    return (
        <>
            <table className="table-bordered table-hover w-100"
                style={{ minWidth: '600px' }}>
                <thead className="font-weight-bold" style={{ background: 'black', color: 'white', fontSize: '0.9rem' }}>
                    <tr>
                        <td className="p-2">Order ID</td>
                        <td className="p-2">Time & Date</td>
                        <td className="p-2">Total Pay</td>
                        {props.isAdmin && (<td className="p-2">Payment Status</td>)}
                        <td className="p-2">Delivery Status</td>
                    </tr>
                </thead>
                <tbody>{props.orders.length > 0 && (Orders())}</tbody>
            </table>
            {
                props.orders.length === 0 && (
                    <div className="no-data-card"><label className='italic-text'>Whoops! No orders to display.</label></div>
                )
            }
        </>
    );
}