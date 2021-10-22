import moment from 'moment';
import OrderStatus from '../OrderStatus/OrderStatus' 

const OrderInfo = (props) => {
    return (
        <div className='border_login col-xl-6 orderInfoCardTopMargin' style={{ marginTop: '20px', marginLeft: '0px' }}>
            <h5>Order Info</h5>
            <div className="row">
                <h6 className="col-xl-6 col-sm-6 orderDate orderInfoFontSize">Order Date - {props.order.placed ?
                    props.order.dateOfPlaced && moment(props.order.dateOfPlaced).format("ll, LT")
                    : props.order.createdAt && moment(props.order.createdAt).format("LT, ll")}
                </h6>
                <h6 className=" orderId orderInfoFontSize">Order ID - {props.order._id}</h6>
            </div>
            <div style={{ marginTop: '20px'}}>
            <OrderStatus  order={props.order} orders={props.orders} auth={props.auth} state={props.state} payType={props.payType} dispatch={props.dispatch}  />
       </div>
        </div>
    )
}
export default OrderInfo