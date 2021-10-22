import { patchData, postData } from '../../utils/fetchData'
import { updateItem } from '../../store/Actions'
import { CONTACT_ADMIN_ERR_MSG, ORDER_CONFIRMATION_MAIL, ORDER_DELIVERED_MAIL } from '../../utils/constants'


const OrderStatus = (props) => {

    const handleAccept = (order) => {
        //Upating the db with accept response from th admin.
        try {
            props.dispatch({ type: 'NOTIFY', payload: { loading: true } })
            patchData(`order/accept/${order._id}`, null, props.auth.token)
                .then(res => {
                    if (res.err) return props.dispatch({ type: 'NOTIFY', payload: { error: res.err } })
                    const { accepted, dateOfAccept } = res.result
                    props.dispatch(updateItem(props.orders, order._id, { ...order, accepted, dateOfAccept }, 'ADD_ORDERS'))
                    return props.dispatch({ type: 'NOTIFY', payload: { success: res.msg } })
                })
            const userData = {
                userName: order.user.name,
                email: order.user.email,
                mailType: ORDER_CONFIRMATION_MAIL,
                subject: `Order ID: ${order._id} accepted by seller`,
                orderUrl: process.env.NEXT_PUBLIC_BASE_URL + `/order/${order._id}`,
            }
            postData('mail', userData, props.auth.token)
        } catch (err) {
            props.dispatch({ type: 'NOTIFY', payload: { error: CONTACT_ADMIN_ERR_MSG } })
        }
    }

    const handleDelivered = (order) => {
        props.dispatch({ type: 'NOTIFY', payload: { loading: true } })

        patchData(`order/delivered/${order._id}`, null, props.auth.token)
            .then(res => {
                if (res.err) return props.dispatch({ type: 'NOTIFY', payload: { error: res.err } })

                const { paid, dateOfPayment, method, delivered } = res.result

                props.dispatch(updateItem(props.orders, order._id, {
                    ...order, paid, dateOfPayment, method, delivered
                }, 'ADD_ORDERS'))

                return props.dispatch({ type: 'NOTIFY', payload: { success: res.msg } })
            })
        const userData = {
            userName: order.user.name,
            mailType: ORDER_DELIVERED_MAIL,
            subject: 'Order Delivered.',
            email: order.user.email,
            orderId: order._id,
            orderUrl: process.env.NEXT_PUBLIC_BASE_URL + `/order/${order._id}`,
        }
        postData('mail', userData, props.auth.token)
    }

    return (
        <div className="col-xl-12 orderStatusFont">
            {props.order.placed &&
                <div className="row">
                    <div className="col-xl-3 col-xs-3">
                        <h6 className="orderStatusMobileTopMarg">Order Status</h6>
                        <div className={` ${props.order.accepted ? 'bg-success' : 'bg-light'}
                                d-flex justify-content-between align-items-center statusInfo_icon`} role="alert">
                            {
                                props.order.accepted ?
                                    // `Order accepted on ${new Date(props.order.dateOfAccept).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })}`
                                    <img className="d-block carouselImg" src="/assets/images/icon/shopping-cart-white.png" alt="First slide" />
                                    :
                                    (props.auth.user.role === 'admin' ?
                                        'Order Placed'
                                        :
                                        // 'Awaiting confirmation.'
                                        <img className="d-block carouselImg" src="/assets/images/icon/shopping-cart-black.png" alt="First slide" />
                                    )
                            }
                            {
                                props.auth.user.role === 'admin' && !props.order.accepted &&
                                <button className="btn btn-dark text-uppercase"
                                    onClick={() => handleAccept(props.order)}>
                                    Accept Order
                                </button>
                            }

                        </div>
                        <p style={{ fontSize: '14px' }}>{
                            props.order.accepted ? `Accepted on ${new Date(props.order.dateOfAccept).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })}` : 'Awaiting confirmation'
                        }
                        </p>
                    </div>

                    <div className="col-xl-3 col-xs-3">
                        <h6>Delivery Status</h6>
                        <div className={`alert ${props.order.delivered ? 'alert-success' : 'alert-warning'}
                                         d-flex justify-content-between align-items-center statusInfo_icon`} role="alert">

                            <div>
                                {
                                    props.order.delivered ? <img className="d-block carouselImg" src="/assets/images/icon/shipped-icon-white.png" alt="First slide" /> : <img className="d-block carouselImg" src="/assets/images/icon/shipped-icon-black.png" alt="First slide" />
                                }
                            </div>
                            {
                                props.auth.user.role === 'admin' && !props.order.delivered &&
                                <button className="btn btn-dark text-uppercase"
                                    style={{ marginLeft: '10px' }}
                                    onClick={() => handleDelivered(props.order)} >
                                    Mark as delivered
                                </button>
                            }

                        </div>
                        <p>
                            {
                                props.order.delivered ? `Delivered on ${new Date(props.payType === 'cod' ? props.order.dateOfPayment : props.order.dateOfAccept).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })}` : 'In Transit'
                            }
                        </p>
                    </div>

                    <div className="col-xl-3 col-xs-3">
                        <h6>Payment</h6>


                        {
                            props.order.paymentId && <p>PaymentId: <em>{props.order.paymentId}</em></p>
                        }

                        <div className={`alert ${props.order.paid ? 'alert-success' : 'alert-danger'}
                                        d-flex justify-content-between align-items-center statusInfo_icon`} role="alert">

                            {
                                props.payType === 'cod' ? props.order.paid ? <img className="d-block carouselImg" src="/assets/images/icon/cash-on-delivery-white.png" alt="First slide" /> : <img className="d-block carouselImg" src="/assets/images/icon/cash-on-delivery-black.png" alt="First slide" /> : 'Not Paid'
                            }

                        </div>
                        {
                            props.order.paid ? `Paid on ${new Date(props.order.dateOfPayment).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })}` : 'Not Paid'
                        }
                        {
                            props.order.method && <h6>Method: <em>{props.order.method}</em></h6>
                        }
                    </div>
                </div>
            }
        </div>

    )
}
export default OrderStatus