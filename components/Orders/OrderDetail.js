import { useEffect, useState, useContext } from 'react'
import OrderInfo from '../OrderInfo/OrderInfo'
import ShippingDetails from '../ShippingDetails/ShippingDetails'
import OrderItems from '../OrderItems'
import Payment from '../Payment/Payment'
import SignInCard from '../SignIn/SignInCard'
import { getData, postData } from '../../utils/fetchData'
import { isEmpty } from 'lodash'
import { DataContext } from '../../store/GlobalState'
import { useRouter } from 'next/router'
import { AUTO_CANCEL_ORDER_JOB, SIGNING_MSG } from '../../utils/constants'
import moment from 'moment'
import { getDuration, notUserRole } from '../../utils/util'

const OrderDetail = () => {
    const { state, dispatch } = useContext(DataContext)
    const { auth } = state
    const [orderDetail, setOrderDetail] = useState();
    const router = useRouter()
    const [timer, setTimer] = useState('')
    const [showTimer, setShowTimer] = useState(false);

    const autoCancelOrder = (order, intervalId) => {
        postData(`jobs`, { order, jobName: AUTO_CANCEL_ORDER_JOB }, auth.token)
        clearInterval(intervalId);
        setShowTimer(false);
        router.push('/');
    }

    const displayTimer = (order) => {
        if (order.placed || isEmpty(order.createdAt) || notUserRole(auth.user.role)) return;
        const ORDER_CANCEL_TIME = process.env.NEXT_PUBLIC_AUTO_CANCEL_ORDER_TIME;
        const cancelDuration = ORDER_CANCEL_TIME * 60;
        const WAIT_TIME = 60 * 3;
        const endTime = moment.utc(order.createdAt).local().add((ORDER_CANCEL_TIME) * 60, 'seconds');
        const intervalId = setInterval(function () {
            // Waiting for 60 seconds and displaying countdown.
            const currentTime = moment().local();
            const secondsRemain = endTime.diff(currentTime, 'seconds');
            if (secondsRemain < (cancelDuration - WAIT_TIME) && secondsRemain > 0) {
                setTimer(getDuration(currentTime, endTime));
                setShowTimer(true);
            } else if (secondsRemain <= 0) {
                autoCancelOrder(order, intervalId);
            } else setShowTimer(false);
        }, 1000);
    }

    useEffect(() => {
        if (!isEmpty(auth) && auth.token && !isEmpty(router.query.id)) {
            getData('order/' + router.query.id, auth.token)
                .then(res => {
                    if (res.err) return dispatch({ type: 'NOTIFY', payload: { error: res.err } });
                    if (res.order) {
                        setOrderDetail(res.order);
                        displayTimer(res.order);
                    }else  router.push('/');
                });
        }
    }, [auth.token, router.query.id])


    if (isEmpty(auth) || isEmpty(auth.token)) return <SignInCard loadingMsg={SIGNING_MSG} delay />;

    return (
        <>
            {orderDetail && (
                <>
                    <div key={orderDetail._id} className="row">
                        <div className="row col-12 justify-content-center">
                            <h3 className="text-uppercase">Order & Payment</h3>
                        </div>
                        {showTimer &&
                            <div className="timer-bar">
                                <i className="fas fa-exclamation-triangle mr-1" style={{ color: 'orange' }} aria-hidden="true"></i>
                                Time remain <span style={{ color: 'red' }}>{timer}</span> to place your order. It will be auto-cancelled after the time lapsed.
                            </div>
                        }
                        <div className="row col-12 justify-content-center">
                            {orderDetail.paid ? <div className='col-xl-7 order-Info-card shadow-card'>
                                <OrderInfo order={orderDetail} auth={auth} state={state} dispatch={dispatch} />
                            </div> : <div className='col-xl-7 shipping-card shadow-card'>
                                <Payment order={orderDetail} auth={auth} dispatch={dispatch} />
                            </div>}
                            <div className="col-xl-4 ml-xl-4 shipping-card shadow-card">
                                <ShippingDetails order={orderDetail} />
                            </div>
                            <div className="col-xl-7 items-card shadow-card">
                                <OrderItems order={orderDetail} auth={auth} />
                            </div>
                           {orderDetail.paid ? <div className='col-xl-4 ml-xl-4 payment-card shadow-card'>
                                <Payment order={orderDetail} auth={auth} dispatch={dispatch} />
                            </div> :" "} 
                        </div>
                    </div>
                </>)
            }
        </>
    )
}

export default OrderDetail