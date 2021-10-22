import { useEffect, useState } from 'react'
import {  ORDER_MAIL, ORDER_ADMIN_MAIL, CONTACT_ADMIN_ERR_MSG, COD} from '../../utils/constants.js'
import { useRouter } from 'next/router'
import { patchData, postData } from '../../utils/fetchData'
import { updateItem } from '../../store/Actions'




const Payment = (props) => {

    const [payBtnText, setPayBtnText] = useState('Click to finish');
    const [payType, setPayType] = useState('');
    const router = useRouter()
    
    
    useEffect(() => {
        props.dispatch({ type: 'NOTIFY', payload: { loading: false } })
        setPayType('cod');
    }, [])

    

    const handlePayment = (e, order) => {
        try {
            e.preventDefault();
            if (props.auth && props.auth.user && !props.auth.user.activated) return  props.dispatch({ type: 'NOTIFY', payload: { error: 'Please activate your account to proceed further.' } })
            if (payType === 'online') return  props.dispatch({ type: 'NOTIFY', payload: { error: 'Online payment is not available at this moment! Please try after sometime.' } })
            if (props.payType === 'cod') return codPay(order)
            
        } catch (err) {
            props.dispatch({ type: 'NOTIFY', payload: { error: CONTACT_ADMIN_ERR_MSG } })
        }
    }

    const codPay = (order) => {
        try {
           
            // DB call to update orderPlaced = true
            patchData('order', { method: COD, id: order._id }, props.auth.token).then(res => {
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
            props.dispatch({ type: 'NOTIFY', payload: { success: 'Order placed! You will be notified once order is accepted.' } })
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
                orderDate: new Date(order.createdAt).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }),
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
        <div className="col-xl-5 mobileTopMarg orderStatusFont">{
            !props.order.placed && !props.order.paid && props.auth.user.role !== 'admin' &&
            <div className='border_login payment-section' style={{ marginLeft: '0px' }}>
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
                <h5 className="my-4 text-uppercase">Total: ₹{props.order.total}.00</h5>
                <button className="btn btn-primary text-uppercase"
                    style={{ width: '100%' }}
                    onClick={(e) => { handlePayment(e, props.order) }}>
                    {payBtnText}
                </button>
            </div>
        }</div>
    )
}
export default Payment
