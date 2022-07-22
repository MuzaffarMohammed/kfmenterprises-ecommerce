import { useEffect, useState, useContext } from 'react'
import OrderInfo from '../OrderInfo/OrderInfo'
import ShippingDetails from '../ShippingDetails/ShippingDetails'
import OrderItems from '../OrderItems'
import Payment from '../Payment/Payment'
import SignInCard from '../SignIn/SignInCard'
import { getData } from '../../utils/fetchData'
import { isEmpty } from 'lodash'
import { DataContext } from '../../store/GlobalState'
import { useRouter } from 'next/router'
import { SIGNING_MSG } from '../../utils/constants'

const OrderDetail = () => {
    const { state, dispatch } = useContext(DataContext)
    const { auth } = state
    const [payType, setPayType] = useState('');
    const [orderDetail, setOrderDetail] = useState();
    const router = useRouter()

    useEffect(() => {
        dispatch({ type: 'NOTIFY', payload: { loading: false } })
        setPayType('cod');
    }, [])


    useEffect(() => {
        if (!isEmpty(auth) && auth.token && !isEmpty(router.query.id)) {
            getData('order/' + router.query.id, auth.token)
                .then(res => {
                    if (res.err) return dispatch({ type: 'NOTIFY', payload: { error: res.err } });
                    if (res.order) setOrderDetail(res.order);
                });
        }
    }, [auth.token, router.query.id])

    if (isEmpty(auth) || isEmpty(auth.token)) return <SignInCard loadingMsg = {SIGNING_MSG} delay/>;

    return (
        <>
            {orderDetail && (
                <div key={orderDetail._id} className="row">
                    <div className="row col-12 justify-content-center">
                        <h3 className="text-uppercase">Order & Payment</h3>
                    </div>
                    <div className="row justify-content-center">
                        <div className='col-xl-7 order-Info-card shadow-card'>
                            <OrderInfo order={orderDetail} auth={auth} state={state} payType={payType} dispatch={dispatch} />
                        </div>
                        <div className="col-xl-4 ml-xl-4 shipping-card shadow-card">
                            <ShippingDetails order={orderDetail} />
                        </div>
                        <div className="col-xl-7 items-card shadow-card">
                            <OrderItems order={orderDetail} auth={auth} />
                        </div>
                        <div className='col-xl-4 ml-xl-4 payment-card shadow-card'>
                            <Payment order={orderDetail} auth={auth} payType={payType} dispatch={dispatch} />
                        </div>
                    </div>
                </div>
            )
            }
        </>
    )
}

export default OrderDetail