import { useEffect, useState } from 'react'
import { ORDER_MAIL, ORDER_ADMIN_MAIL, CONTACT_ADMIN_ERR_MSG, COD } from '../../utils/constants.js'
import { useRouter } from 'next/router'
import { patchData, postData } from '../../utils/fetchData'
import { updateItem } from '../../store/Actions'
import { razorPayOptions } from '../../utils/payUtil.js'
import { parseToIndiaTime } from '../../utils/util.js'

const Payment = (props) => {

    const [payBtnText, setPayBtnText] = useState('Click to finish');
    const [payType, setPayType] = useState('');
    const router = useRouter()

    useEffect(() => {
        isLoading(false);
    }, [])

    const isLoading = (loading) => {
        props.dispatch({ type: 'NOTIFY', payload: { loading } })
    }

    const handlePayment = (e, order) => {
        try {
            e.preventDefault();
            if (props.auth && props.auth.user && !props.auth.user.activated) return props.dispatch({ type: 'NOTIFY', payload: { error: 'Please activate your account to proceed further.' } })
            if (payType === 'online') return onlinePay(order)
            if (payType === 'cod') return placeOrderAndNotifyUser(order, 'COD')
        } catch (err) {
            props.dispatch({ type: 'NOTIFY', payload: { error: CONTACT_ADMIN_ERR_MSG } })
        }
    }

    const onlinePay = (order) => {
        try {
            props.dispatch({ type: 'NOTIFY', payload: { loading: true, isPay: true, msg: 'Securely redirecting to payment page, please wait.' } })
            patchData(`order/payment/${order._id}`, {}, props.auth.token)
                .then(res => {
                    isLoading(false);
                    if (res.err) return props.dispatch({ type: 'NOTIFY', payload: { error: res.err } });
                    const payOptions = {
                        ...razorPayOptions,
                        amount: order.total,
                        order_id: res.rPayOrderId,
                        handler: (res) => onPaySuccess(res, order),
                        prefill: {
                            name: order.user.mail,
                            email: order.user.email,
                            contact: order.mobile
                        },
                        notes: {
                            address: order.address
                        }
                    };

                    var rzp1 = new Razorpay(payOptions);
                    rzp1.on('payment.failed', function (res) {
                        isLoading(false);
                        throw res.error;
                    });
                    rzp1.open();
                }).catch(err => {
                    isLoading(false);
                    throw err;
                })
        } catch (err) {
            console.log(err);
            props.dispatch({ type: 'NOTIFY', payload: { error: CONTACT_ADMIN_ERR_MSG } })
        }
    }

    const onPaySuccess = (res, order) => {
        const data = {
            orderId: order._id,
            payPaymentId: res.razorpay_payment_id,
            paySignature: res.razorpay_signature
        }
        postData('order/payment/verify', data, props.auth.token).then(res => {
            console.log("Res : ", res);
            if (res && res.verified) {
                placeOrderAndNotifyUser(order, res.method);
            } else {
                props.dispatch({ type: 'NOTIFY', payload: { error: res && res.error ? res.error : CONTACT_ADMIN_ERR_MSG } });
            }
        })
    }

    const placeOrderAndNotifyUser = (order, payMethod) => {
        try {
            // DB call to update orderPlaced = true
            patchData('order', { method: payMethod, id: order._id }, props.auth.token).then(res => {
                // On success response
                if (res.err) return props.dispatch({ type: 'NOTIFY', payload: { error: CONTACT_ADMIN_ERR_MSG } })

                const { placed, dateOfPlaced, method } = res.result
                // Updating state
                props.dispatch(updateItem(props.orders, order._id, {
                    ...order, placed, dateOfPlaced, method
                }, 'ADD_ORDERS'))
            })
            // Emptying the cart after order placed.
            props.dispatch({ type: 'ADD_CART', payload: [] })
            //props.dispatch({ type: 'NOTIFY', payload: { success: 'Order placed! You will be notified once order is accepted.' } })
            // Sending order mail to customer and admin.
            notifyUserAndAdminAboutOrder(order);
            // Redirecting to Thank you for shopping page.
            return router.push('/thankyou')
        } catch (err) {
            console.log(err)
            props.dispatch({ type: 'NOTIFY', payload: { error: CONTACT_ADMIN_ERR_MSG } })
        }
    }

    const notifyUserAndAdminAboutOrder = (order) => {
        if (props.auth && props.auth.user && props.auth.user.email) {
            console.log('order : ', order)
            const userData = {
                userName: props.auth.user.name,
                email: props.auth.user.email,
                address: order.address,
                mobile: order.mobile,
                orderId: order._id,
                orderDate: parseToIndiaTime(new Date(order.createdAt)),
                id: props.auth.user.id,
                mailType: ORDER_MAIL,
                subject: 'Order placed!',
                orderUrl: process.env.NEXT_PUBLIC_BASE_URL + `/order/${order._id}`,
            }
            // Order placed summary mail to user
            postData('mail', userData, props.auth.token)
            // Order placed notification mail to Admin
            const adminData = {
                orderUrl: process.env.NEXT_PUBLIC_BASE_URL + `/order/${order._id}`,
                userName: props.auth.user.name,
                email: process.env.NEXT_PUBLIC_ADMIN_ID,
                address: order.address,
                mobile: order.mobile,
                cusEmail: props.auth.user.email,
                orderId: order._id,
                mailType: ORDER_ADMIN_MAIL,
                subject: 'New Order Request - Mode Of Payment: [' + payType + ']'
            }
            postData('mail', adminData, props.auth.token)
        }
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

    if (!props.auth.user) return null;
    return (
        <div className="col-xl-4 mobileTopMarg orderStatusFont">{
            !props.order.paid && props.auth.user.role !== 'admin' &&
            <div className='border_login payment-section' style={{ marginLeft: '0px' }}>
                <h5> 4. Select a payment method</h5>
                <div className='d-flex'>
                    <label className='mt-3' style={{ width: '100px' }}>Pay Mode: </label>
                    <select name="payType" id="payType" value={payType} placeholder='Select a payment method'
                        onChange={handlePayTypeChange} className="mt-2 custom-select text-capitalize">
                        <option value="select">Select</option>
                        <option value="online">Online Payment</option>
                        <option value="cod">Cash on delivery</option>
                    </select>
                </div>
                <label className="mt-3">Delivery Chargers:
                    <span style={{ marginLeft: '5px', textDecoration: 'line-through', color: 'red' }}> ₹95 </span>
                    <span style={{ marginLeft: '5px', color: 'green' }}>  ₹0.00 Free </span>
                </label>
                <h5 className="my-4 text-uppercase">Total: ₹{props.order.total}.00</h5>
                <button
                    id="rzp-button1"
                    className="btn btn-primary text-uppercase"
                    style={{ width: '100%' }}
                    onClick={(e) => { handlePayment(e, props.order) }}>
                    {payBtnText}
                </button>
            </div>
        }</div>
    )
}
export default Payment
