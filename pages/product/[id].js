import Head from 'next/head'
import { useState, useContext } from 'react'
import { getData } from '../../utils/fetchData'
import { DataContext } from '../../store/GlobalState'
import { addToCart } from '../../store/Actions'
import { calculateDiscountedPercentage } from '../../utils/util'
import { ProductPrice } from '../../components/product/ProductPrice'

const DetailProduct = (props) => {
    const [product] = useState(props.product)
    const [tab, setTab] = useState(0)

    const { state, dispatch } = useContext(DataContext)
    const { cart, auth } = state
    const isAdmin = auth && auth.user && auth.user.role === 'admin'

    const isActive = (index) => {
        if (tab === index) return " active";
        return ""
    }

    const dispatchAddToCart = () => {
        const res = addToCart(product, cart);
        dispatch(res)
        if (res.type === "ADD_CART") dispatch({ type: 'NOTIFY', payload: { success: 'Product is added to cart.' } })
    }

    return (
        <div className="container-fluid row detail_page">
            <Head>
                <title>KFM Cart - Product Detail</title>
            </Head>
            <h4 className="col-xl-12 text-center mt-2 mb-0 text-capitalize" title={product.title}>
                {product.title}
            </h4>
            <div className="col-xl-5 col-xs-12">
                <img src={product.images[tab].url} alt={product.title}
                    className="d-block img-thumbnail rounded mt-2 w-100 prodDetailImg" />
                <div className="prodDetialmultiImgs row mx-0 mt-1" style={{ cursor: 'pointer' }} >
                    {product.images.map((img, index) => (
                        <img key={index} src={img.url}
                            className={`img-thumbnail rounded ${isActive(index)}`}
                            style={{ height: '100%', width: '20%' }}
                            onClick={() => setTab(index)} />
                    ))}
                </div>
            </div>
            <div className="col-xl-6 col-xs-12 mt-3 mx-xl-4">
                <div>
                    <ProductPrice product={product} isAdmin={isAdmin} isProductDetailPage={true} />
                </div>
                <button className="btn btn-success d-block my-2 px-5"
                    disabled={isAdmin ? true : false}
                    onClick={() => { dispatchAddToCart() }} >
                    Add to Cart
                    <i className="fas fa-shopping-cart pl-1" aria-hidden="true" ></i>
                </button>

                <div className="my-3">
                    <h5>Description</h5>
                    {product.description}
                </div>
                <div className="my-3">
                    <h5>About this item</h5>
                    {product.content}
                </div>
            </div>
        </div>
    )
}

export async function getServerSideProps({ params: { id } }) {

    const res = await getData(`product/${id}`)
    // server side rendering
    return {
        props: { product: res.product }, // will be passed to the page component as props
    }
}


export default DetailProduct