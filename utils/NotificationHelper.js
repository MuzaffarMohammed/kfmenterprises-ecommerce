import { DANGER, NORMAL, WARNING } from "./constants";
import { postData } from "./fetchData";

export const updateCheckedNotifications = (_id, notifications, auth, dispatch) => {
    postData('notifications', { _id, checked: true }, auth.token);
    dispatch(deleteItem(notifications, _id, 'NOTIFICATIONS'));
}

export const applyFilter = (selectedTypes, notificationsArr) => {
    if (!notificationsArr) return [];
    if (selectedTypes.indexOf('All') >= 0) return notificationsArr
    else return notificationsArr.filter(item => selectedTypes.indexOf(item.type) >= 0)
}

export const getFilterbtns = (notifications) => {
    const btns = [
        {
            type: 'All',
            name: 'All',
            description: 'All notifications',
            count: notifications && notifications.length
        },
        {
            type: NORMAL,
            name: 'Normal',
            description: 'All normal notifications',
            count: filterNotificationsByType(NORMAL, notifications).length
        },
        {
            type: WARNING,
            name: 'Warning',
            description: 'All warning notifications',
            count: filterNotificationsByType(WARNING, notifications).length
        },
        {
            type: DANGER,
            name: 'Severe',
            description: 'All severe notifications',
            count: filterNotificationsByType(DANGER, notifications).length
        }
    ];
    return btns;
}

const filterNotificationsByType = (type, notifications) => notifications ? notifications.filter(item => item.type === type) : [];