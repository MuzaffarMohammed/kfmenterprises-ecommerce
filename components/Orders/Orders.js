import { useContext, useEffect, useState } from 'react'
import { DataContext } from '../../store/GlobalState'
import OrdersGrid from './OrdersGrid';
import Filters from './Filters'
import { applyFilter, getAllFiltersLengths } from './filtersUtil';
import { postData } from '../../utils/fetchData';
import { isLoading } from '../../utils/util';
import isEmpty from 'lodash/isEmpty';
import { sub } from 'date-fns'
import DateRangeSelector from "../Custom_Components/DateRangeSelector";
import { useRouter } from 'next/router';

export default function Orders() {
    const { state, dispatch } = useContext(DataContext);
    const router = useRouter()
    const { auth } = state;
    const isAdmin = auth && auth.user && auth.user.role === 'admin';
    const isUser = auth && auth.user && auth.user.role === 'user';
    const [filterLengths, setFilterLengths] = useState({})
    const [orders, setOrders] = useState([])
    const [filteredOrders, setFilteredOrders] = useState([]);
    const query = router.query;
    const [dateRange, setDateRange] = useState([
        {
            startDate: query.st ? new Date(`${query.st} 00:00:00`) : sub(new Date(), { months: 6 }),
            endDate: query.st ? new Date(`${query.st} 23:59:00`) : new Date(),
            key: 'selection'
        }
    ])

    useEffect(() => {
        if (!isEmpty(auth) && auth.token && !isEmpty(dateRange)) {
            isLoading(true, dispatch)
            postData('order', { dateRange, type: 'GET' }, auth.token)
                .then(res => {
                    isLoading(false, dispatch)
                    if (res.err) setFilteredOrders([]);
                    else {
                        // dispatch({ type: 'ADD_ORDERS', payload: res.orders })
                        const lengths = getAllFiltersLengths(res.orders, isUser);
                        setFilterLengths(lengths);
                        setOrders(res.orders);
                        setFilteredOrders(res.orders);
                    }
                })
        }
    }, [auth.token, dateRange])


    const handleFilter = (filterType) => {
        const filteredOrdersList = applyFilter(filterType, orders, isUser);
        setFilteredOrders(filteredOrdersList);
    }

    if (!auth.user) return null;

    return (
        <div className="justify-content-between">
            <h2 className="container text-uppercase mt-3" >Orders</h2>
            <div className="my-3">
                {/* <div>
                    <div className="float-right">
                        <Filters isAdmin={isAdmin} isUser={isUser} handleFilter={handleFilter} lengths={filterLengths} />
                    </div>
                    <div className="float-left">
                        <DateRangeSelector handleSelect={(range) => {
                            console.log('range', range)
                            setDateRange(range)
                        }
                        }
                            dateFormat='MMM dd, yyyy'
                            defaultRange={dateRange}
                        />
                    </div>
                </div> */}
                <div className="p-2 mt-4 table-responsive orders-grid">
                    <OrdersGrid orders={filteredOrders} isAdmin={isAdmin} isUser={isUser} />
                </div>
            </div>
        </div>
    );
}