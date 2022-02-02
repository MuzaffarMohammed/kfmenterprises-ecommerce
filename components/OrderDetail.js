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

                    <div key={order._id} style={{ margin: '10px auto' }} className="border_login row justify-content-around">
                        <div className="row col-12 justify-content-center" style={{ background: '#144271', color: 'white' }}>
                            <h4 className='primary my-3'>SHIPPING & PAYMENT</h4>
                        </div>
                        <div className=" col-xl-12">
                            <div className="mt-4 row justify-content-md-between">
                                <OrderInfo order={order} orders={orders} auth={auth} state={state} payType={payType} dispatch={dispatch} />
                                <ShippingDetails order={order} />
                                <OrderItems order={order} auth={auth} />                
                                <Payment order={order} orders={orders} auth={auth} payType={payType} dispatch={dispatch}/>
                            </div>
                        </div>
                    </div>
                ))
            }
        </>
    )
}

export default OrderDetail