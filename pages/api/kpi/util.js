import { getCurrencyFormattedValue, getDates } from '../../../utils/util'
import { DATE_FORMAT, REGISTERED_CUSTOMERS, RISK_INDEX, SALES_BY_RANGE, TICK_FORMAT, TOTAL_ORDERS, TOTAL_PRODUCTS, TOTAL_SALES } from '../../../utils/constants';
import { format } from 'date-fns'
import isEmpty from 'lodash/isEmpty';

export const getParameterValue = (name, orders, products, users, notifications, dateRange) => {
    switch (name) {
        case TOTAL_PRODUCTS:
            return products && products.length;
        case TOTAL_ORDERS:
            return orders && orders.length;
        case TOTAL_SALES:
            const totalSales = orders.reduce((total, item) => total + item.total, 0);
            return getCurrencyFormattedValue(totalSales);
        case REGISTERED_CUSTOMERS:
            return users.length;
        case RISK_INDEX:
            return notifications.length;
        case SALES_BY_RANGE:
            return getSalesArr(orders, dateRange);
        default:
            return undefined;
    }
}

const getSalesArr = (orders, dateRange) => {
    let salesArr = [];
    let dateArr = [];
    let time_series = {};
    if (!isEmpty(orders)) {
        orders.forEach(order => {
            const date = format(order.createdAt, DATE_FORMAT);
            if (!time_series[date]) time_series[date] = order.total;
            time_series[date] = time_series[date] + order.total;
        });
        const allDates = getDates(dateRange[0].startDate, dateRange[0].endDate);
        //console.log('allDates: ', allDates)
        allDates.forEach(date => {
            if (!time_series[date]) salesArr.push(0);
            else salesArr.push(time_series[date]);

            dateArr.push(date);
        });
        return { sales: salesArr, dates: dateArr }
    }
}

export const getTimeSeriesSalesData = (orders, dateRange, kpi) => {
    let columns = [];
    let kpiData = {};
    kpi.data.columns.forEach(column => {
        const data = getParameterValue(column, orders, null, null, null, dateRange);
        if (!isEmpty(data)) {

            let colData = [kpi.data.columns[1], ...data['dates']];
            columns.push(colData);

            colData = [column, ...data['sales']];
            columns.push(colData);

            colData = ['Sales Spike', ...data['sales']];
            columns.push(colData);

        } else columns = [];

        if (!isEmpty(columns)) {
            kpiData = {
                id: kpi.id,
                singleAnalysis: kpi.singleAnalysis,
                name: kpi.name,
                data: {
                    type: kpi.data.type,
                    types: { 'Sales Spike': 'line' },
                    x: kpi.data.columns[1],
                    xFormat: TICK_FORMAT,
                    columns: columns
                }
            };
        }
    });
    return kpiData;
}