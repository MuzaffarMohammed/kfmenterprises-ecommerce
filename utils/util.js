import { DATE_FORMAT, ERROR_401, PLEASE_LOG_IN } from "./constants";
import isEmpty from 'lodash/isEmpty';
import add from 'date-fns/add'
import { format } from 'date-fns'

export const renameFile = (originalFile, newName) => {
    return new File([originalFile], newName, {
        type: originalFile.type,
        lastModified: originalFile.lastModified,
    });
}

export const isAdmin = (auth, dispatch) => {
    if (auth && auth.user && auth.user.role !== 'admin')
        return dispatch({ type: 'NOTIFY', payload: { error: ERROR_401 } })
}

export const isLoggedIn = (auth, dispatch, router) => {
    if (isEmpty(auth)) {
        dispatch({ type: 'NOTIFY', payload: { error: PLEASE_LOG_IN } })
        router.push("/signin")
    }
}

export const convertINRPaise = (rupee) => {
    if (!rupee) return;
    return rupee * 100;
}

export const parseToIndiaTime = (date) => {
    return date.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
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
        currentDate = add(currentDate, {days:1});
    }
    return dateArray;
}
