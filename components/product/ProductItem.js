import Link from 'next/link'
import { useContext } from 'react'
import { DataContext } from '../../store/GlobalState'
import { addToCart } from '../../store/Actions'
import { ProductPrice } from './ProductPrice'

const ProductItem = ({ product, handleCheck }) => {
    const { state, dispatch } = useContext(DataContext)
    const { cart, auth } = state
    const isAdmin = auth && auth.user && auth.user.role === 'admin'

    const dispatchAddToCart = () => {
        const res = addToCart(product, cart);
        dispatch(res)
        if (res.type === "ADD_CART") dispatch({ type: 'NOTIFY', payload: { success: 'Product is added to cart.' } })
    }

    const userLink = () => {
        return (
            <>
                <Link href={`/product/${product._id}`}>
                    <a className="btn btn-primary"
                        style={{ marginRight: '5px', fontSize: '12px' }}>
                        View
                        {/* <i className="fas fa-search pl-1" aria-hidden="true" ></i> */}
                    </a>
                </Link>
                <button className="btn btn-success"
                    style={{ marginLeft: '5px', flex: 1, fontSize: '12px' }}
                    disabled={product.inStock === 0 ? true : false}
                    onClick={() => { dispatchAddToCart() }} >
                    Add to Cart
                    {/* <i className="fas fa-shopping-cart pl-1" aria-hidden="true" ></i> */}
                </button>
            </>
        )
    }

    const adminLink = () => {
        return (
            <>
                <Link href={`/create/${product._id}`}>
                    <a className="btn btn-primary"
                        style={{ marginRight: '5px', flex: 1 }}>Edit</a>
                </Link>
                <button className="btn btn-danger"
                    style={{ marginLeft: '5px', flex: 1 }}
                    data-toggle="modal" data-target="#confirmModal"
                    onClick={() => dispatch({
                        type: 'ADD_MODAL',
                        payload: {
                            data: [{ id: product._id }],
                            title: product.title,
                            content: 'Do you want to delete this item?',
                            type: 'DELETE_PRODUCT'
                        }
                    })} >
                    Delete
                </button>
            </>
        )
    }

    return (
        <div className="card">
            {
                auth.user && auth.user.role === 'admin' &&
                <input type="checkbox" checked={product.checked}
                    className="position-absolute"
                    style={{ height: '20px', width: '20px' }}
                    onChange={() => handleCheck(product._id)} />
            }
            <Link href={`/product/${product._id}`}>
                <img className="card-img-top" src={product.images[0].url} alt={product.title} />
            </Link>
            <div className="card-body">
                <ProductPrice product={product} isAdmin={isAdmin} />
                <div className="row justify-content-between mx-0 pt-1">
                    {!auth.user || auth.user.role !== "admin" ? userLink() : adminLink()}
                </div>
            </div>
        </div>
    )
}


export default ProductItem