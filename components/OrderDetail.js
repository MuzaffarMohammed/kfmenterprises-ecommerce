import { useEffect, useState } from 'react'
import OrderInfo from './OrderInfo/OrderInfo'
import ShippingDetails from './ShippingDetails/ShippingDetails'
import OrderItems from './OrderItems'
import Payment from './Payment/Payment'

const OrderDetail = ({ orderDetail, state, dispatch }) => {
    const { auth, orders } = state
    const [payType, setPayType] = useState('');


    useEffect(() => {
        dispatch({ type: 'NOTIFY', payload: { loading: false } })
        setPayType('cod');
    }, [])

    if (!auth.user) return null;
    return (
        <>
            {
                orderDetail.map(order => (
                    <div key={order._id} className="row">
                        <div className="row col-12 justify-content-center">
                        <h3 className="text-uppercase">Order & Payment</h3>
                        </div>
                        <div className="row justify-content-center">
                                <div className='col-xl-7 order-Info-card shadow-card'>
                                    <OrderInfo order={order} orders={orders} auth={auth} state={state} payType={payType} dispatch={dispatch} />
                                </div>
                                <div className="col-xl-4 ml-xl-4 shipping-card shadow-card">
                                    <ShippingDetails order={order} />
                                </div>
                                <div className="col-xl-7 items-card shadow-card">
                                    <OrderItems order={order} auth={auth} />
                                </div>
                                <div className='col-xl-4 ml-xl-4 payment-card shadow-card'>
                                    <Payment order={order} orders={orders} auth={auth} payType={payType} dispatch={dispatch} />
                                </div>
                           
                        </div>
                    </div>
                ))
            }
        </>
    )
}

export default OrderDetail