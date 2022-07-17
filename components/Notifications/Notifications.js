import React, { useContext, useEffect, useState } from 'react'
import Menu from '../Custom_Components/Menu'
import Dropdown from 'react-bootstrap/Dropdown';
import { postData } from '../../utils/fetchData';
import { DataContext } from '../../store/GlobalState';
import { getAction, formatDateTime } from '../../utils/util';
import { deleteItem } from '../../store/Actions';
import { isEmpty } from 'lodash';

function Notifications() {
    const { state, dispatch } = useContext(DataContext);
    const { auth, notifications } = state;
    const [notificationsArr, setnotificationsArr] = useState()
    const [notificationLength, setNotificationLength] = useState();


    useEffect(() => {
        if (!isEmpty(notifications)) {
            setnotificationsArr(notifications);
            setNotificationLength(notifications.length)
        }
    }, [notifications])


    const handleMenuItemClick = (notification) => {
        postData('notifications', { _id: notification._id, checked: true }, auth.token);
        dispatch(deleteItem(notifications, notification._id, 'NOTIFICATIONS'));
    }
    const handleMenuClick = () => setNotificationLength(0);

    const NotificationList = () => {
        return (
            <>
                {notificationsArr && notificationsArr.length > 0 ?
                    notificationsArr.map((item, i) => (
                        <div className="menu-item" key={i}>
                            <Dropdown.Item href={getAction(item.action)} onClick={() => { handleMenuItemClick(item) }}>
                                <div style={{ whiteSpace: 'break-spaces' }}>
                                    {item.createdAt &&
                                        <span style={{ fontSize: 'x-small', fontWeight: 'bold' }}>
                                            {formatDateTime(item.createdAt)}
                                        </span>
                                    }
                                    {item.notification &&
                                        <div className={`text-${item.severity}`}>
                                            {item.notification}
                                        </div>
                                    }
                                </div>
                            </Dropdown.Item>
                            <Dropdown.Divider />
                        </div>
                    ))
                    :
                    <div style={{ fontSize: 'small', padding: '6px', textAlign: 'center', color: 'grey' }}>{'No new notifications yet.'}</div>
                }
            </>
        )
    }
    return (
        <>
            <Menu title=
                {
                    <>
                        <i className="fas fa-bell" aria-hidden="true" >
                            {notificationLength > 0 ?
                                <>
                                    <span className="count-badge count-badge-notification">
                                        {notificationLength}
                                    </span>
                                    <span className="navbar-menu-text" style={{ paddingLeft: notificationLength > 9 ? '25px' : '20px' }}>Notifications</span>
                                </>
                                :
                                <span className="navbar-menu-text">Notifications</span>
                            }
                        </i>
                    </>
                }
                handleMenuClick={handleMenuClick}
                menuItems={<NotificationList />}
            />
        </>
    )
}

export default Notifications