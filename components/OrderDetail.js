import Link from 'next/link'
import { useEffect, useState } from 'react'
import {patchData, postData} from '../utils/fetchData'
import {updateItem} from '../store/Actions'
import { useRouter } from 'next/router'
import { ORDER_MAIL } from '../utils/constants.js'


const OrderDetail = ({orderDetail, state, dispatch}) => {
    const {auth, orders} = state
    const [payType, setPayType] = useState('');
    const [payBtnText, setPayBtnText] = useState('Click to finish');
    const router = useRouter()

    useEffect(() => {
        dispatch({ type: 'NOTIFY', payload: {loading: false} })
        setPayType('cod');
    },[])

    const handlePayment = (e, order) =>{
        e.preventDefault();
        if(auth && auth.user && !auth.user.activated) return dispatch({type: 'NOTIFY', payload: {error: 'Please activate your account to proceed further.'}})
        if(payType === 'online') return dispatch({type: 'NOTIFY', payload: {error: 'Online payment is not available at this moment! Please try after sometime.'}})
        if(payType === 'cod'){
            dispatch({ type: 'ADD_CART', payload: [] })
            dispatch({ type: 'NOTIFY', payload: {success: 'Order placed! You will be notified once order is accepted.'} })
            notifyUserAndAdminAboutOrder(order);
            return router.push('/thankyou')
        }
    }

    const notifyUserAndAdminAboutOrder = (order) =>{
        if(auth && auth.user && auth.user.email){
           console.log('order : ',order)
           const userData = {
                                userName: auth.user.name, 
                                email: auth.user.email,
                                address: order.address,
                                mobile: order.mobile, 
                                orderId: order._id,
                                orderDate: order.createdAt, 
                                id: auth.user.id, 
                                mailType: ORDER_MAIL, 
                                subject:'Order placed!',
                                
                            }
           
            postData('mail', userData, auth.token)
            

            
            postData('mail', {userName: auth.user.name, email: process.env.NEXT_PUBLIC_ADMIN_ID, id: auth.user.id, mailType: ORDER_MAIL, subject:'New Order Request - Mode Of Payment: ['+payType+']'}, auth.token)
        }
    }

    const handleDelivered = (order) => {
        dispatch({type: 'NOTIFY', payload: {loading: true}})

        patchData(`order/delivered/${order._id}`, null, auth.token)
        .then(res => {
            if(res.err) return dispatch({type: 'NOTIFY', payload: {error: res.err}})

            const { paid, dateOfPayment, method, delivered } = res.result

            dispatch(updateItem(orders, order._id, {
                ...order, paid, dateOfPayment, method, delivered
            }, 'ADD_ORDERS'))

            return dispatch({type: 'NOTIFY', payload: {success: res.msg}})
        })
    }

    const handlePayTypeChange = (e) =>{
        const {name, value} = e.target;
        setPayType(value)
        if(value === 'online'){
            setPayBtnText('Proceed to pay')
        }else{
            setPayBtnText('Click to finish')
        }
    }

    if(!auth.user) return null;
    return(
        <>
        {
            orderDetail.map(order => (
                
            <div key={order._id} style={{margin: '20px auto'}} className="border_login row justify-content-around">
                <div className="row col-12 justify-content-center">
                    <h4 className='primary p-3'>SHIPPING & PAYMENT</h4>
                </div>
                <div className="my-3" style={{maxWidth: '600px'}}>
                    <h6>Order ID - {order._id}</h6>
                    <div className="mt-4 text-secondary">
                        <div>
                            <h5>Order Items</h5>
                            {
                                order.cart.map(item => (
                                    <div className="row border-bottom mx-0 p-4 justify-content-betwenn
                                    align-items-center" key={item._id} style={{maxWidth: '550px'}}>
                                        <img src={item.images[0].url} alt={item.images[0].url}
                                        style={{width: '50px', height: '45px', objectFit: 'cover'}} />
                                        <h5 className="flex-fill text-secondary px-3 m-0">
                                            <Link href={`/product/${item._id}`}>
                                                <a>{item.title}</a>
                                            </Link>
                                        </h5>
                                        <span className="text-info m-0">
                                            {item.quantity} x ₹{item.totalPrice} = ₹{item.totalPrice * item.quantity}
                                        </span>

                                    </div>
                                ))
                            }
                        </div>
                        <div className="border_login" style={{marginTop:'20px' ,marginLeft:'0px'}}>
                            <h6>Shipping Details</h6>
                            <p style={{marginTop:'25px'}}>Name: {order.user.name}</p>
                            <p>Email: {order.user.email}</p>
                            <p>Address: {order.address}</p>
                            <p>Mobile: {order.mobile}</p>
                        </div>
                        <h5 style={{marginTop:'20px'}}>Delivery Status</h5>
                        <div className={`alert ${order.delivered ? 'alert-success' : 'alert-danger'}
                        d-flex justify-content-between align-items-center`} role="alert">
                            {
                                order.delivered ? `Delivered on ${order.updatedAt}` : 'Not Delivered'
                            }
                            {
                                auth.user.role === 'admin' && !order.delivered &&
                                <button className="btn btn-dark text-uppercase"
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
                                order.paid ? `Paid on ${order.dateOfPayment}` : 'Not Paid'
                            }
                            
                        </div>
                    </div>
                </div>  
                {
                    !order.paid && auth.user.role !== 'admin' &&
                    <div>
                        <h3>Select a payment method</h3>
                        <select name="payType" id="payType" value={payType} placeholder='Select a payment method'
                                onChange={handlePayTypeChange} className="mt-2 custom-select text-capitalize">
                                    <option value="cod">Cash on delivery</option>
                                    <option value="online">Online Payment</option>
                                </select>
                        <h6 className="mt-4">Delivery Chargers:
                            <span style={{marginLeft:'5px', textDecoration: 'line-through', color:'red'}}> ₹95 </span> 
                            <span style={{marginLeft:'5px',color:'green'}}>  ₹0.00 Free </span>
                        </h6>
                        <h5 className="my-4 text-uppercase">Total: ₹{order.total}.00</h5>
                        
                        <button className="btn btn-primary text-uppercase"
                                onClick={(e) =>{handlePayment(e, order)}}>
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