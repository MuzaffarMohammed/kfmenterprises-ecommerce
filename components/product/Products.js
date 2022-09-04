import { useEffect, useState } from "react";
import { useContext } from "react";
import { DataContext } from "../../store/GlobalState";
import { getData } from "../../utils/fetchData";
// import RemoteTableGrid from "../Custom_Components/RemoteTableGrid";
import Loading from "../Loading";
import { productColumns } from "./util";

export const Products = () => {

    const { state, dispatch } = useContext(DataContext);
    const { auth } = state;
    const isAdmin = auth && auth.user && auth.user.role === 'admin';
    const [page, setPage] = useState(1)
    const [sizePerPage, setSizePerPage] = useState(10)
    const [products, setProducts] = useState([]);
    const [columns, setColumns] = useState(productColumns);
    const [totalCount, setTotalCount] = useState(0);
    const [sortColumn, setSortColumn] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const getProducts = (page, sizePerPage) => {
        setIsLoading(true)
        getData(`product?limit=${sizePerPage}&page=${page}&category=all&title=all`, auth.token)
            .then(res => {
                setIsLoading(false)
                if (res.err) return dispatch({ type: 'NOTIFY', payload: { error: res.err } })
                if (res.products) {
                    setProducts(res.products);
                }
            })
    }

    useEffect(() => {
        if (auth && auth.token) {
            getProducts(page, sizePerPage);
            getData(`product?type=GET_COUNT`, auth.token)
                .then(res => {
                    if (res.err) return dispatch({ type: 'NOTIFY', payload: { error: res.err } })
                    if (res.count) setTotalCount(res.count)
                })
        }
    }, [auth.token]);

    const handleTableChange = (type, { page, sizePerPage }) => {
        if (type === 'pagination') {
            setPage(page);
            setSizePerPage(sizePerPage);
        }
        getProducts(page, sizePerPage);
    }

    if (!isAdmin) return null;

    return (
        <div className="justify-content-between">
            <h2 className="container text-uppercase mt-3" >Products</h2>
            <div className="my-3 shadow-card">
                {/* {isLoading && <Loading />} */}
                {/* <RemoteTableGrid
                    keyField='id'
                    columns={columns}
                    data={products}
                    page={page}
                    sizePerPage={sizePerPage}
                    totalSize={totalCount}
                    handleTableChange={handleTableChange}
                /> */}
            </div>
        </div>
    )
}
