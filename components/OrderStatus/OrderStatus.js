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
        <div className="main_container">
            <div className="card-body">
                <div className="steps d-flex flex-wrap flex-sm-nowrap justify-content-between padding-top-2x padding-bottom-1x">

                    <div className={props.order.accepted ? 'step completed' : 'step'}>
                        <div className="row">
                            <div className="step-icon-wrap">
                                <div className="step-icon"><i className="pe-7s-cart"></i></div>
                            </div>
                            <div className="label-align">
                                <h4 className={props.order.accepted ? 'step-title-after' : 'step-title-before'}>
                                    {
                                        props.order.accepted ?
                                            `Order Confirmed  ${new Date(props.order.dateOfAccept).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })}`
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
                                <div className="step-icon"><i className="pe-7s-config"></i></div>
                            </div>
                            <div className="label-align">
                                <h4 className={props.order.accepted ? 'step-title-after' : 'step-title-before'}>Processing Order</h4>
                            </div>
                        </div>
                    </div>

                    <div className={props.order.delivered ? 'step completed' : 'step'}>
                        <div className="row">
                            <div className="step-icon-wrap ">
                                <div className="step-icon"><i className="pe-7s-car"></i></div>
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
                                <div className="step-icon"><i className="pe-7s-home"></i></div>
                            </div>

                            <div className="label-align">
                                <h4 className={props.order.delivered ? 'step-title-after' : 'step-title-before'}>
                                    {
                                        props.order.delivered ? `Delivered on ${new Date(props.payType === 'cod' ? props.order.dateOfPayment : props.order.dateOfAccept).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })}` : 'Not Yet Delivered'
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