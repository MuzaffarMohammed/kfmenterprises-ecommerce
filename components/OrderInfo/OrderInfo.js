import moment from 'moment';
import OrderStatus from '../OrderStatus/OrderStatus' 

const OrderInfo = (props) => {
    return (
        <div className='border_login col-xl-7 orderInfoCardTopMargin' style={{ marginTop: '10px', marginLeft: '0px' }}>
            <h5>1. Order Information</h5>
            <div className="row mt-3 justify-content-between">
                <h6 className="col-xl-6 col-sm-6 orderInfoFontSize">Order Date: {props.order.placed ?
                    props.order.dateOfPlaced && moment(props.order.dateOfPlaced).format("ll, LT")
                    : props.order.createdAt && moment(props.order.createdAt).format("LT, ll")}
                </h6>
                <h6 className="orderInfoFontSize">Order ID: {props.order._id}</h6>
            </div>
            <div style={{ marginTop: '20px'}}>
            <OrderStatus  order={props.order} orders={props.orders} auth={props.auth} state={props.state} payType={props.payType} dispatch={props.dispatch}  />
       </div>
        </div>
    )
}
export default OrderInfo