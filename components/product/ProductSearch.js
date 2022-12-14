import { useRouter } from "next/router";
import { useContext, useEffect, useRef, useState } from "react";
import { DataContext } from "../../store/GlobalState";
import { DEFAULT_MAX_PRODUCTS_LIMIT } from "../../utils/constants";
import { getData } from "../../utils/fetchData";
import { isAdminRole, isLoading } from "../../utils/util";
import DeleteAllProductsButton from "../AdminComponents/DeleteAllProductsButton";
import Filter from "../Filter";
import ProductItem from "./ProductItem";


export const ProductSearch = () => {

    const { state, dispatch } = useContext(DataContext)
    const router = useRouter()
    const query = router.query
    const { auth, categories } = state
    const isAdmin = auth && auth.user && isAdminRole(auth.user.role);
    const [products, setProducts] = useState([])
    const ALL = 'all';
    const [category, setCategory] = useState(query.category ? query.category : ALL)
    let page = useRef(1)
    let limit = useRef(DEFAULT_MAX_PRODUCTS_LIMIT)
    const [sort, setSort] = useState(query.sort ? query.sort : 'title')
    const [searchText, setSearchText] = useState(query.search ? query.search : '')
    const [count, setCount] = useState(0)
    const [isCheck, setIsCheck] = useState(false)
    const [delProducts, setDelProducts] = useState([])

    const search = (category, searchText, sort) => {
        isLoading(true, dispatch)
        getData(`product?page=${1}&limit=${limit.current}&category=${category}&sort=${sort}&title=${searchText}`)
            .then(res => {
                isLoading(false, dispatch);
                if (res.err) setProducts([]);
                else {
                    setProducts(res.products);
                    setCount(res.count);
                }
            });
        isLoading(false, dispatch);
    }

    useEffect(() => {
        if (query.category) {
            setCategory(query.category);
            search(query.category, searchText, sort);
        }
    }, [query.category])


    const handleCheck = (id) => {
        products.forEach(product => {
            if (product._id === id) product.checked = !product.checked
        })
        setProducts([...products])
    }

    const handleCheckALL = () => {
        delProducts.forEach(product => product.checked = !isCheck)
        setDelProducts([...delProducts])
        setIsCheck(!isCheck)
    }

    const handleCategory = (val) => {
        setCategory(val);
        limit.current = DEFAULT_MAX_PRODUCTS_LIMIT;
        search(val, searchText, sort);
    }

    const handleSort = (val) => {
        setSort(val);
        limit.current = DEFAULT_MAX_PRODUCTS_LIMIT;
        search(category, searchText, val);
    }

    const handleSearch = (val) => {
        setSearchText(val);
        limit.current = DEFAULT_MAX_PRODUCTS_LIMIT;
        search(category, val, sort);
    }

    const handleLoadMore = () => {
        page.current += 1;
        limit.current = page.current * DEFAULT_MAX_PRODUCTS_LIMIT
        search(category, searchText, sort);
    }

    return (
        <>
            <div className="pt-4">
                <Filter isAdmin={isAdmin} categories={categories} selectedCategory={category} searchText={searchText} selectedSort={sort}
                    handleCategory={handleCategory} handleSearch={handleSearch} handleSort={handleSort} />
                {/* {isAdmin && <div className="">
                    <div className="row justify-content-center">
                        <DeleteAllProductsButton delProducts={delProducts} handleCheckALL={handleCheckALL} dispatch={dispatch} isCheck={isCheck} />
                    </div>
                </div> }
                */}
            </div>
            <div className="products">
                {
                    products && products.map(product => (
                        <ProductItem key={product._id} product={product} handleCheck={handleCheck} />
                    ))
                }
            </div>
            {
                count < DEFAULT_MAX_PRODUCTS_LIMIT ? ""
                    : <button className="btn btn-outline-primary d-block mx-auto mb-4" onClick={handleLoadMore}>
                        Load More
                    </button>
            }
        </>
    )
}