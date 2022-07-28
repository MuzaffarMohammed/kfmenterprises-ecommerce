import { ADMIN_ROLE, DATE_FORMAT, ERROR_403, ORDER_DETAIL, PLEASE_LOG_IN, SIGNING_MSG, TOKEN_EXPIRED_ERROR, USER_ROLE } from "./constants";
import isEmpty from 'lodash/isEmpty';
import add from 'date-fns/add'
import { format } from 'date-fns'
import moment from "moment";
import SignInCard from "../components/SignIn/SignInCard";

export const renameFile = (originalFile, newName) => {
    return new File([originalFile], newName, {
        type: originalFile.type,
        lastModified: originalFile.lastModified,
    });
}

export const isAdmin = (auth, dispatch) => {
    if (auth && auth.user && auth.user.role !== 'admin')
        return dispatch({ type: 'NOTIFY', payload: { error: ERROR_403 } })
}

export const isLoggedIn = (auth) => {
    return (isEmpty(auth) || isEmpty(auth.token))
}

export const convertINRPaise = (rupee) => {
    if (!rupee) return;
    return rupee * 100;
}

export const formatDateTime = (date, format) => {
    const timeZone = process.env.NEXT_PUBLIC_TZ || process.env.TZ;
    return moment(date).format(format ? format : "LT, ll");
}

export const formatDateTimeInsideData = (data, field) => {
    data.map((item, i) => {
        const formattedDateTime = formatDateTime(data[i][field]);
        item = {
            ...data[i],
            [field]: formattedDateTime
        }
    });
    return data;
}

export const isLoading = (loading, dispatch) => {
    dispatch({ type: 'NOTIFY', payload: { loading } })
}

export const getCurrencyFormattedValue = (value) => {
    const currencyFormat = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: process.env.NEXT_PUBLIC_RAZORPAY_CURRENCY
    })
    return currencyFormat.format(value);
}

export const getStartAndEndDateTimeOfCurrentWeek = (curr) => {
    var first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
    var last = first + 6; // last day is the first day + 6

    var firstday = new Date(curr.setDate(first)).toISOString();
    var lastday = new Date(curr.setDate(last)).toISOString();
    return [firstday, lastday];
}

export const getDates = (startDate, stopDate) => {
    var dateArray = [];
    var currentDate = new Date(startDate);
    var stopDate = new Date(stopDate);
    while (currentDate <= stopDate) {
        dateArray.push(format(currentDate, DATE_FORMAT))
        currentDate = add(currentDate, { days: 1 });
    }
    return dateArray;
}


export const getAction = (action) => {
    if (isEmpty(action) || !action.type) return '';
    switch (action.type) {
        case ORDER_DETAIL:
            return `order?id=${action.data && action.data.orderId}`
        default:
            return "";
    }
}

export const notUserRole = (role) => { return role !== USER_ROLE };
export const isUserRole = (role) => { return role === USER_ROLE };
export const notAdminRole = (role) => { return role !== ADMIN_ROLE };
export const notAdminNotUserRole = (role) => { return role !== ADMIN_ROLE && role !== USER_ROLE };