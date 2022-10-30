import { useEffect, useState, useContext } from "react";
import { DataContext } from "../../store/GlobalState";
import { getData } from "../../utils/fetchData";
import TableGrid from "../Custom_Components/TableGrid";
import Loading from "../Loading";
import { productColumns } from "./util";

export const ProductList = () => {

    const { state, dispatch } = useContext(DataContext);
    const { auth } = state;
    const isAdmin = auth && auth.user && auth.user.role === 'admin';
    const [page, setPage] = useState(1)
    const sizePerPage = 10
    const [products, setProducts] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false)

    const getProducts = (page, sizePerPage) => {
        setIsLoading(true)
        getData(`product?limit=${sizePerPage}&page=${page}&category=all`, auth.token)
            .then(res => {
                setIsLoading(false)
                if (res.err) return dispatch({ type: 'NOTIFY', payload: { error: res.err } })
                if (res.products) {
                    setProducts(res.products);
                }
            })
    }

    useEffect(() => {
        if (auth && auth.token && page) {
            getProducts(page, sizePerPage);
            getData(`product?type=GET_COUNT`, auth.token)
                .then(res => {
                    if (res.err) return dispatch({ type: 'NOTIFY', payload: { error: res.err } })
                    if (res.count) setTotalCount(res.count)
                })
        }
    }, [auth.token, page]);

    if (!isAdmin) return null;

    return (
        <div className="justify-content-between">
            <h2 className="container text-uppercase mt-3" >Products</h2>
            <div className="mt-3 table-responsive shadow-card">
                {isLoading && <Loading />}
                {products &&
                    <TableGrid columns={productColumns} rows={products} totalCount={totalCount} isAdmin={isAdmin} isDbPaginate pageChange={page => setPage(page)} />
                }
            </div>
        </div>
    )
}
