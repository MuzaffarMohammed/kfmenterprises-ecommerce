import Link from 'next/link'
import { useEffect, useState } from 'react'
import { patchData, postData } from '../utils/fetchData'
import { updateItem } from '../store/Actions'
import { useRouter } from 'next/router'
import { ORDER_MAIL, ORDER_ADMIN_MAIL, CONTACT_ADMIN_ERR_MSG, ORDER_CONFIRMATION_MAIL, ORDER_DELIVERED_MAIL, COD } from '../utils/constants.js'
import moment from 'moment';

const OrderDetail = ({ orderDetail, state, dispatch }) => {
    const { auth, orders } = state
    const [payType, setPayType] = useState('');
    const [payBtnText, setPayBtnText] = useState('Click to finish');
    const router = useRouter()

    useEffect(() => {
        dispatch({ type: 'NOTIFY', payload: { loading: false } })
        setPayType('cod');
    }, [])

    const handlePayment = (e, order) => {
        try {
            e.preventDefault();
            if (auth && auth.user && !auth.user.activated) return dispatch({ type: 'NOTIFY', payload: { error: 'Please activate your account to proceed further.' } })
            if (payType === 'online') return dispatch({ type: 'NOTIFY', payload: { error: 'Online payment is not available at this moment! Please try after sometime.', delay: 8000 } })
            if (payType === 'cod') return codPay(order)
        } catch (err) {
            dispatch({ type: 'NOTIFY', payload: { error: CONTACT_ADMIN_ERR_MSG } })
        }
    }

    const codPay = (order) => {
        try {
            // DB call to update orderPlaced = true
            patchData('order', { method: COD, id: order._id }, auth.token).then(res => {
                // On success response
                if (res.err) return dispatch({ type: 'NOTIFY', payload: { error: CONTACT_ADMIN_ERR_MSG } })

                const { placed, dateOfPlaced, method } = res.result
                // Updating state
                dispatch(updateItem(orders, order._id, {
                    ...order, placed, dateOfPlaced, method
                }, 'ADD_ORDERS'))
            })
            // Emptying the cart after order placed.
            dispatch({ type: 'ADD_CART', payload: [] })
            dispatch({ type: 'NOTIFY', payload: { success: 'Order placed! You will be notified once order is accepted.' } })
            // Sending order mail to customer and admin.
            notifyUserAndAdminAboutOrder(order);
            // Redirecting to Thank you for shopping page.
            return router.push('/thankyou')
        } catch (err) {
            dispatch({ type: 'NOTIFY', payload: { error: CONTACT_ADMIN_ERR_MSG } })
        }
    }

    const notifyUserAndAdminAboutOrder = (order) => {
        if (auth && auth.user && auth.user.email) {
            const userData = {
                userName: auth.user.name,
                email: auth.user.email,
                address: order.address,
                mobile: order.mobile,
                orderId: order._id,
                orderDate: new Date(order.createdAt).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }),
                id: auth.user.id,
                mailType: ORDER_MAIL,
                subject: 'Order placed!',
                orderUrl: process.env.NEXT_PUBLIC_BASE_URL + `/order/${order._id}`,
            }
            // Order placed summary mail to user
            postData('mail', userData, auth.token)
            // Order placed notification mail to Admin
            const adminData = {
                orderUrl: process.env.NEXT_PUBLIC_BASE_URL + `/order/${order._id}`,
                userName: auth.user.name,
                email: process.env.NEXT_PUBLIC_ADMIN_ID,
                address: order.address,
                mobile: order.mobile,
                cusEmail: auth.user.email,
                orderId: order._id,
                mailType: ORDER_ADMIN_MAIL,
                subject: 'New Order Request - Mode Of Payment: [' + payType + ']'
            }
            postData('mail', adminData, auth.token)
        }
    }

    const handleAccept = (order) => {
        //Upating the db with accept response from th admin.
        try {
            dispatch({ type: 'NOTIFY', payload: { loading: true } })
            patchData(`order/accept/${order._id}`, null, auth.token)
                .then(res => {
                    if (res.err) return dispatch({ type: 'NOTIFY', payload: { error: res.err } })
                    const { accepted, dateOfAccept } = res.result
                    dispatch(updateItem(orders, order._id, { ...order, accepted, dateOfAccept }, 'ADD_ORDERS'))
                    return dispatch({ type: 'NOTIFY', payload: { success: res.msg } })
                })
            const userData = {
                userName: order.user.name,
                email: order.user.email,
                mailType: ORDER_CONFIRMATION_MAIL,
                subject: `Order ID: ${order._id} accepted by seller`,
                orderUrl: process.env.NEXT_PUBLIC_BASE_URL + `/order/${order._id}`,
            }
            postData('mail', userData, auth.token)
        } catch (err) {
            dispatch({ type: 'NOTIFY', payload: { error: CONTACT_ADMIN_ERR_MSG } })
        }
    }

    const handleDelivered = (order) => {
        dispatch({ type: 'NOTIFY', payload: { loading: true } })

        patchData(`order/delivered/${order._id}`, null, auth.token)
            .then(res => {
                if (res.err) return dispatch({ type: 'NOTIFY', payload: { error: res.err } })

                const { paid, dateOfPayment, method, delivered } = res.result

                dispatch(updateItem(orders, order._id, {
                    ...order, paid, dateOfPayment, method, delivered
                }, 'ADD_ORDERS'))

                return dispatch({ type: 'NOTIFY', payload: { success: res.msg } })
            })
        const userData = {
            userName: order.user.name,
            mailType: ORDER_DELIVERED_MAIL,
            subject: 'Order Delivered.',
            email: order.user.email,
            orderId: order._id,
            orderUrl: process.env.NEXT_PUBLIC_BASE_URL + `/order/${order._id}`,
        }
        postData('mail', userData, auth.token)
    }

    const handlePayTypeChange = (e) => {
        const { name, value } = e.target;
        setPayType(value)
        if (value === 'online') {
            setPayBtnText('Proceed to pay')
        } else {
            setPayBtnText('Click to finish')
        }
    }
    if (!auth.user) return null;
    return (
        <>
            {
                orderDetail.map(order => (

                    <div key={order._id} style={{ margin: '20px auto' }} className="border_login row justify-content-around">
                        <div className="row col-12 justify-content-center" style={{ background: '#144271', color: 'white' }}>
                            <h4 className='primary my-3'>SHIPPING & PAYMENT</h4>
                        </div>
                        <div className="my-3" style={{ maxWidth: '600px' }}>
                            <h6>Order ID - {order._id}</h6>
                            <div className={`alert ${order.dateOfPlaced ? 'alert-success' : 'alert-warning'}
                                d-flex justify-content-between align-items-center`} role="alert">
                                <h6>Order PlacedAt:  {order.placed ?
                                    order.dateOfPlaced && moment(order.dateOfPlaced).format("LT, ll")
                                    : order.createdAt && moment(order.createdAt).format("LT, ll")}
                                </h6>
                            </div>
                            <div className="mt-4">
                                <div className='border_login' style={{ marginTop: '20px', marginLeft: '0px' }}>
                                    <h5>Order Items</h5>
                                    {
                                        order.cart.map(item => (
                                            <div className="row border-bottom mx-0 p-4 justify-content-betwenn
                                        align-items-center" key={item._id} style={{ maxWidth: '550px' }}>
                                                <img src={item.images[0].url} alt={item.title}
                                                    style={{ width: '50px', height: '45px', objectFit: 'cover' }} />
                                                <div className="flex-fill font-weight-normal px-3 m-0">
                                                    <Link href={`/product/${item._id}`}>
                                                        <a>{item.title}</a>
                                                    </Link>
                                                </div>
                                                <br></br>
                                                <span className="text-info mt-2">
                                                    {item.quantity} x ₹{item.totalPrice} = ₹{item.totalPrice * item.quantity}
                                                </span>

                                            </div>
                                        ))
                                    }
                                </div>
                                <div className="border_login" style={{ marginTop: '20px', marginLeft: '0px' }}>
                                    <h5>Shipping Details</h5>
                                    <p style={{ marginTop: '25px' }}>Name: {order.user.name}</p>
                                    <p>Email: {order.user.email}</p>
                                    <p>Address: {order.address}</p>
                                    <p>Mobile: {order.mobile}</p>
                                </div>
                                {order.placed &&
                                    <div>
                                        <h5 style={{ marginTop: '20px' }}>Order Status</h5>
                                        <div className={`alert ${order.accepted ? 'alert-success' : 'alert-warning'}
                                d-flex justify-content-between align-items-center`} role="alert">
                                            {
                                                order.accepted ?
                                                    `Order accepted on ${new Date(order.dateOfAccept).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })}`
                                                    :
                                                    (auth.user.role === 'admin' ?
                                                        'Order Placed'
                                                        :
                                                        'Awaiting confirmation from the seller, we will notify you once order is accepted.')
                                            }
                                            {
                                                auth.user.role === 'admin' && !order.accepted &&
                                                <button className="btn btn-primary text-uppercase"
                                                    onClick={() => handleAccept(order)}>
                                                    Accept Order
                                                </button>
                                            }

                                        </div>
                                        <h5 style={{ marginTop: '20px' }}>Delivery Status</h5>
                                        <div className={`alert ${order.delivered ? 'alert-success' : 'alert-warning'}
                            d-flex justify-content-between align-items-center`} role="alert">
                                            {
                                                order.delivered ? `Delivered on ${new Date(payType === 'cod' ? order.dateOfPayment : order.dateOfAccept).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })}` : 'Not Delivered'
                                            }
                                            {
                                                auth.user.role === 'admin' && !order.delivered &&
                                                <button className="btn btn-primary text-uppercase"
                                                    style={{ marginLeft: '10px' }}
                                                    onClick={() => handleDelivered(order)}>
                                                    Mark as delivered
                                                </button>
                                            }

                                        </div>

                                        <h5>Payment</h5>
                                        {
                                            order.method && <h6>Method: <em>{order.method}</em></h6>
                                        }

                                        {
                                            order.paymentId && <p>PaymentId: <em>{order.paymentId}</em></p>
                                        }

                                        <div className={`alert ${order.paid ? 'alert-success' : 'alert-danger'}
                            d-flex justify-content-between align-items-center`} role="alert">
                                            {
                                                order.paid ? `Paid on ${new Date(order.dateOfPayment).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })}` : 'Not Paid'
                                            }

                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                        {
                            !order.placed && !order.paid && auth.user.role !== 'admin' &&
                            <div className='border_login payment-section' style={{ marginLeft: '0px', maxWidth: '600px' }}>
                                <h5> Select a payment method</h5>
                                <select name="payType" id="payType" value={payType} placeholder='Select a payment method'
                                    onChange={handlePayTypeChange} className="mt-2 custom-select text-capitalize">
                                    <option value="cod">Cash on delivery</option>
                                    <option value="online">Online Payment</option>
                                </select>
                                <h6 className="mt-4">Delivery Chargers:
                                    <span style={{ marginLeft: '5px', textDecoration: 'line-through', color: 'red' }}> ₹95 </span>
                                    <span style={{ marginLeft: '5px', color: 'green' }}>  ₹0.00 Free </span>
                                </h6>
                                <h5 className="my-4 text-uppercase">Total: ₹{order.total}.00</h5>
                                <button className="btn btn-primary text-uppercase"
                                    style={{ width: '100%' }}
                                    onClick={(e) => { handlePayment(e, order) }}>
                                    {payBtnText}
                                </button>
                            </div>
                        }

                    </div>
                ))
            }
        </>
    )
}

export default OrderDetail