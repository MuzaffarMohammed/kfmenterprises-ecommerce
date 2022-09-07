import React, { useContext, useEffect, useState } from 'react'
import { DataContext } from '../../store/GlobalState';
import { isEmpty } from 'lodash';
import { applyFilter, getFilterbtns, updateCheckedNotifications } from '../../utils/NotificationHelper';
import { formatDateTime, getAction, isLoading } from '../../utils/util';
import FilterBtns from '../Custom_Components/FilterBtns';
import { useRouter } from 'next/router';
import { getData } from '../../utils/fetchData';
import {handleUIError} from '../../middleware/error'

function Notifications() {
    const { state, dispatch } = useContext(DataContext);
    const { auth } = state;
    const router = useRouter()
    const query = router.query;
    const [notificationsArr, setNotificationsArr] = useState()
    const [filteredNotifications, setFilteredNotifications] = useState()
    const [filterBtns, setFilterBtns] = useState([])
    const [selectedTypes, setSelectedTypes] = useState([])
    const isAdmin = auth && auth.user && auth.user.role === 'admin';

    useEffect(() => {
        if (!isEmpty(auth.token)) {
            isLoading(true, dispatch)
            getData('notifications', auth.token)
                .then(res => {
                    isLoading(false, dispatch)
                    if (res.code) return handleUIError(res.err, res.code, auth, dispatch);
                    if (!isEmpty(res.notifications)) setNotificationsArr(res.notifications)
                })
        }
    }, [auth.token])

    useEffect(() => {
        isLoading(false, dispatch)
        if (notificationsArr) {
            const types = isEmpty(query.type) ? (isEmpty(selectedTypes) ? ['All'] : selectedTypes) : (query.type === 'wd' && isEmpty(selectedTypes) ? ['warning', 'danger'] : selectedTypes);
            setSelectedTypes(types);
            const filteredNList = applyFilter(types, notificationsArr);
            setFilteredNotifications(filteredNList)
            const filterButtons = getFilterbtns(notificationsArr);
            setFilterBtns(filterButtons)
        }
    }, [notificationsArr, query.type])

    const handleFilter = (filterType) => {
        setSelectedTypes([filterType]);
        const filteredNList = applyFilter([filterType], notificationsArr);
        setFilteredNotifications(filteredNList);
    }

    return (
        <div className="justify-content-between">
            <h2 className="container text-uppercase mt-3" >Notifications</h2>
            <div className="my-3">
                {isAdmin &&
                    <div className='row  my-3 justify-content-center'>
                        <FilterBtns filterBtns={filterBtns} handleFilter={handleFilter} />
                    </div>
                }
                {
                    (filteredNotifications && filteredNotifications.length > 0)
                        ? filteredNotifications.map((item, i) => (
                            <div key={i}>
                                {item.createdAt &&
                                    <span style={{ fontSize: 'x-small', fontWeight: 'bold' }}>
                                        {formatDateTime(item.createdAt)}
                                    </span>
                                }
                                <div className='mb-4 shadow-card notification-card' style={{ whiteSpace: 'break-spaces' }}>
                                    <a className={`text-${item.type}`} href={getAction(item.action)} onClick={() => { updateCheckedNotifications(item._id, notifications, auth, dispatch) }}>
                                        <div>
                                            {item.notification}
                                        </div>
                                    </a>
                                </div>
                            </div>
                        ))
                        :
                        <div>
                            <div className='mb-4 shadow-card notification-card' style={{ whiteSpace: 'break-spaces' }}>
                                <div className='row justify-content-center italic-text'>
                                    Whoops! No notifications to display.
                                </div>
                            </div>
                        </div>
                }
            </div>
        </div>
    )
}

export default Notifications