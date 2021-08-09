
import { useContext, useEffect, useState } from 'react'
import { DataContext } from '../../store/GlobalState'
import OrdersGrid from './OrdersGrid';
import Filters from './Filters'
import { applyFilter, getAllFiltersLengths } from './filtersUtil';

export default function Orders() {
    const { state, dispatch } = useContext(DataContext);
    const { auth, orders } = state;
    const isAdmin = auth && auth.user && auth.user.role === 'admin';
    const isUser = auth && auth.user && auth.user.role === 'user';
    const [filterLengths, setFilterLengths] = useState({})
    const [filteredOrders, setFilteredOrders] = useState(orders);

    useEffect(() => {
        if (orders) {
            const lengths = getAllFiltersLengths(orders);
            setFilterLengths(lengths);
            setFilteredOrders(orders);
        }
    }, [orders])

    const handleFilter = (filterType) => {
        const filteredOrdersList = applyFilter(filterType, orders);
        setFilteredOrders(filteredOrdersList);
    }

    return (
        <div className="col-md-8 mgtop">
            <h3 className="text-uppercase">Orders</h3>
            <div className="my-3">
                <div className="p-1">
                    <Filters isAdmin={isAdmin} isUser={isUser} handleFilter={handleFilter} lengths={filterLengths} />
                </div>
                <div className="p-1 table-responsive order-grid-height">
                    <OrdersGrid orders={filteredOrders} isAdmin={isAdmin} isUser={isUser} />
                </div>
            </div>
        </div>
    );
}