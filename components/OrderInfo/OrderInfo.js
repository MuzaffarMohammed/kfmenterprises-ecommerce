import moment from 'moment';
import OrderStatus from '../OrderStatus/OrderStatus'

const OrderInfo = (props) => {
    return (
        <>
            <div className="row order-step-header">
                <h6>Order Information</h6>
            </div>
            <div className="row mt-3 justify-content-between font-weight-bold">
                <label>Order Id: {props.order._id}</label>
                <label>Order Date: {props.order.placed ?
                    props.order.dateOfPlaced && moment(props.order.dateOfPlaced).format("ll, LT")
                    : props.order.createdAt && moment(props.order.createdAt).format("LT, ll")}
                </label>
            </div>
            <div style={{ marginTop: '20px' }}>
                <OrderStatus order={props.order} orders={props.orders} auth={props.auth} state={props.state} payType={props.payType} dispatch={props.dispatch} />
            </div>
        </>
    )
}
export default OrderInfo