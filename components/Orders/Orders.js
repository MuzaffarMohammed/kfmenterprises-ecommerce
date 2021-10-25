import { useContext, useEffect, useState } from 'react'
import { DataContext } from '../../store/GlobalState'
import OrdersGrid from './OrdersGrid';
import Filters from './Filters'
import { applyFilter, getAllFiltersLengths } from './filtersUtil';
import { getData } from '../../utils/fetchData';

export default function Orders() {
    const { state, dispatch } = useContext(DataContext);
    const { auth, orders } = state;
    const isAdmin = auth && auth.user && auth.user.role === 'admin';
    const isUser = auth && auth.user && auth.user.role === 'user';
    const [filterLengths, setFilterLengths] = useState({})
    const [filteredOrders, setFilteredOrders] = useState(orders);


    useEffect(() => {
        getData('order', auth.token)
            .then(res => {
                if (res.err) setFilteredOrders([]);
                else {
                    const lengths = getAllFiltersLengths(res.orders);
                    setFilterLengths(lengths);
                    setFilteredOrders(res.orders);
                }
            })
    }, [])

    useEffect(() => {
        if (orders) {

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
                <div className="p-2 table-responsive orders-grid">
                    <OrdersGrid orders={filteredOrders} isAdmin={isAdmin} isUser={isUser} />
                </div>
            </div>
        </div>
    );
}