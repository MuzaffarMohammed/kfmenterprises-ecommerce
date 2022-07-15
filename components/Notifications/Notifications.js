import React from 'react'
import { useState, useEffect } from 'react'
import Menu from '../Custom_Components/Menu'
import Dropdown from 'react-bootstrap/Dropdown';

function Notifications() {
    const [notifications, setNotifications] = useState([{ number: 1, name: 'New order request, please accept the order, customer is awaiting your response or else order will be dismissed!', time: '2:30pm 15-07-2022', color: 'primary' }, { number: 2, name: 'Product out of stock!', time: '12:00pm 15-07-2022', color: 'danger' }, { number: 3, name: 'Product delivered!', time: '09:54pm 14-07-2022', color: 'success' }])

    const handleMenuItemClick = (number) => {
        console.log('Menu clicked : ', number)
    }

    useEffect(() => {
       // setNotifications([]);
    }, [])


    const NotificationList = () => {
        return (
            <>
                {notifications && notifications.length > 0 ?
                    notifications.map((item, i) => (
                        <div className="menu-item" key={i}>
                            <Dropdown.Item href={item.href} onClick={() => { handleMenuItemClick(item.number) }}>
                                <div style={{ whiteSpace: 'break-spaces' }}>
                                    {item.time &&
                                        <span style={{ fontSize: 'x-small', fontWeight: 'bold' }}>
                                            {item.time}
                                        </span>
                                    }
                                    {item.name &&
                                        <div className={`text-${item.color}`}>
                                            {item.name}
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
                            {notifications && notifications.length > 0 ?
                                <>
                                    <span className="position-absolute notification-count-badge">
                                        {notifications.length}
                                    </span>
                                    <span className="menu-text" style={{ paddingLeft: '20px' }}>Notifications</span>
                                </>
                                :
                                <span className="menu-text">Notifications</span>
                            }
                        </i>
                    </>
                }
                menuItems={<NotificationList />}
            />
        </>
    )
}

export default Notifications