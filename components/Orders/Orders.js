import { useContext, useEffect, useState } from 'react'
import { DataContext } from '../../store/GlobalState'
import OrdersGrid from './OrdersGrid';
import Filters from './Filters'
import { applyFilter, getAllFiltersLengths } from './filtersUtil';
import { getData } from '../../utils/fetchData';
import { isLoading } from '../../utils/util';

export default function Orders() {
    const { state, dispatch } = useContext(DataContext);
    const { auth, orders } = state;
    const isAdmin = auth && auth.user && auth.user.role === 'admin';
    const isUser = auth && auth.user && auth.user.role === 'user';
    const [filterLengths, setFilterLengths] = useState({})
    const [filteredOrders, setFilteredOrders] = useState(orders);


    useEffect(() => {
        isLoading(true, dispatch)
        getData('order', auth.token)
            .then(res => {
                isLoading(false, dispatch)
                if (res.err) setFilteredOrders([]);
                else {
                    const lengths = getAllFiltersLengths(res.orders);
                    setFilterLengths(lengths);
                    setFilteredOrders(res.orders);
                }
            })
    }, [auth])

    const handleFilter = (filterType) => {
        const filteredOrdersList = applyFilter(filterType, orders);
        setFilteredOrders(filteredOrdersList);
    }

    if (!auth.user) return null;

    return (
        <div className="justify-content-between">
            <h2 className="container text-uppercase mt-3" >Orders</h2>
            <div className="my-3">
                <div className="p-1">
                    <Filters isAdmin={isAdmin} isUser={isUser} handleFilter={handleFilter} lengths={filterLengths} />
                </div>
                <div className="p-2 table-responsive orders-grid">
                    <OrdersGrid orders={filteredOrders} isAdmin={isAdmin} isUser={isUser} />
                </div>
            </div>
        </div>
    );
}