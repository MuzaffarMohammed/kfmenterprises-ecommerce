import Head from 'next/head'
import { useState, useContext } from 'react'
import { getData } from '../../utils/fetchData'
import { DataContext } from '../../store/GlobalState'
import { addToCart } from '../../store/Actions'

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
            <div className="col-xl-6 col-xs-12">
                <img src={product.images[tab].url} alt={product.title}
                    className="d-block img-thumbnail rounded mt-4 w-100 prodDetailImg" />
                <div className="prodDetialmultiImgs row mx-0 mt-1" style={{ cursor: 'pointer' }} >
                    {product.images.map((img, index) => (
                        <img key={index} src={img.url}
                            className={`img-thumbnail rounded ${isActive(index)}`}
                            style={{ height: '100%', width: '20%' }}
                            onClick={() => setTab(index)} />
                    ))}
                </div>
            </div>
            <div className="col-xl-5 col-xs-12 mt-4 mx-3">
                <h2 className="text-uppercase">{product.title}</h2>
                <h6 style={{ textDecoration: 'line-through', color: 'grey', fontSize: '12px', fontWeight:900 }}><label style={{marginRight: '5px', color: '#144271', fontSize: '12px', fontWeight:700 }}>MRP: </label> ₹{product.mrpPrice.toFixed(2)}</h6>
                <h5 style={{color:'#000'}}><label style={{marginRight: '5px', color: '#144271', fontSize: '1.25rem', fontWeight:700 }}>Our Price: </label>₹{product.totalPrice}</h5>
                <div className="row mx-0 d-flex justify-content-between">
                    {
                        product.inStock > 0
                            ? <h6 className="text-success">In Stock {isAdmin ? ":" + product.inStock : ""}</h6>
                            : <h6 className="text-danger">Out Of Stock</h6>
                    }

                    {/* <h6 className="text-danger">Sold: {product.sold}</h6> */}
                </div>

                <div className="my-2">
                    <h5>Description</h5>
                    {product.description}
                </div>
                <div className="my-2">
                    <h5>About this item</h5>
                    {product.content}
                </div>

                <button type="button" className="btn btn-primary d-block my-3 px-5"
                    disabled={isAdmin ? true : false}
                    onClick={() => { dispatchAddToCart() }} >
                    Buy
                </button>

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