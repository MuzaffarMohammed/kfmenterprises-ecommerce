import { patchData, postData } from '../../utils/fetchData'
import { updateItem } from '../../store/Actions'
import { CONTACT_ADMIN_ERR_MSG, ORDER_CONFIRMATION_MAIL, ORDER_DELIVERED_MAIL } from '../../utils/constants'
import { parseToIndiaTime } from '../../utils/util'




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
        <div className="main_container">
            <div className="card-body">
                <div className="steps d-flex flex-wrap flex-sm-nowrap justify-content-between padding-top-2x padding-bottom-1x">

                    <div className={props.order.accepted ? 'step completed' : 'step'}>
                        <div className="row">
                            <div className="step-icon-wrap">
                                <div className="step-icon"> {props.order.accepted ? <img src="../assets/images/icon/shopping-cart-white-10925.svg" className="cartIcon" /> : <img src="../assets/images/icon/shopping-cart-10925.svg" className="cartIcon" />} </div>
                            </div>
                            <div className="label-align">
                                <h4 className={props.order.accepted ? 'step-title-after' : 'step-title-await-before'}>
                                    {
                                        props.order.accepted ?
                                            `Order Confirmed on ${parseToIndiaTime(new Date())}`
                                            :
                                            (props.auth.user.role === 'admin' ? 'Order Placed' : 'Awaiting Confirmation')
                                    }
                                </h4>
                                {
                                    props.auth.user.role === 'admin' && !props.order.accepted &&
                                    <button className="btn btn-dark text-uppercase order-handle-button"
                                        onClick={() => handleAccept(props.order)}>
                                        Accept Order
                                    </button>
                                }
                            </div>
                        </div>
                    </div>

                    <div className={props.order.accepted ? 'step completed' : 'step'}>
                        <div className="row">
                            <div className="step-icon-wrap ">
                                <div className="step-icon">{props.order.accepted ? <img src="../assets/images/icon/settings-white-5671.svg" className="cartIcon" /> : <img src="../assets/images/icon/settings-5670.svg" className="cartIcon" />} </div>
                            </div>
                            <div className="label-align">
                                <h4 className={props.order.accepted ? 'step-title-after' : 'step-title-before'}>{props.order.delivered ? 'Order Processed' : 'Processing Order'}</h4>
                            </div>
                        </div>
                    </div>

                    <div className={props.order.delivered ? 'step completed' : 'step'}>
                        <div className="row">
                            <div className="step-icon-wrap ">
                                <div className="step-icon">{props.order.delivered ? <img src="../assets/images/icon/delivery.svg" className="cartIcon" /> : <img src="../assets/images/icon/delivery-white.svg" className="cartIcon" />}</div>
                            </div>

                            <div className="label-align">
                                <h4 className={props.order.delivered ? 'step-title-after' : 'step-title-before'}>
                                    {
                                        props.order.delivered ? 'Product Delivered' : 'In Transit'
                                    }
                                </h4>
                            </div>
                        </div>
                    </div>

                    <div className={props.order.delivered ? 'step completed' : 'step'}>
                        <div className="row">
                            <div className="step-icon-wrap ">
                                <div className="step-icon">{props.order.delivered ? <img src="../assets/images/icon/home-white.svg" className="cartIcon" /> : <img src="../assets/images/icon/home.svg" className="cartIcon" />}</div>
                            </div>

                            <div className="label-align">
                                <h4 className={props.order.delivered ? 'step-title-after' : 'step-title-before'}>
                                    {
                                        props.order.delivered ? `Delivered on ${parseToIndiaTime(new Date(props.payType === 'cod' ? props.order.dateOfPayment : props.order.dateOfAccept))}` : 'Not Yet Delivered'
                                    }
                                </h4>
                                {
                                    props.auth.user.role === 'admin' && !props.order.delivered &&
                                    <button className="btn btn-dark text-uppercase order-handle-button"
                                        disabled={props.order.accepted ? false : true}
                                        onClick={() => handleDelivered(props.order)} >
                                        Mark as delivered
                                    </button>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default OrderStatus