import Link from 'next/link'
import { decrease, increase } from '../store/Actions'
import { getData } from '../utils/fetchData'

const plusProductCountClick = async (cart, itemId, quantity, dispatch) => {
    const res = await getData(`product/${itemId}?count=true`)
    if (res.error) return;
    if (res.count && quantity < res.count) dispatch(increase(cart, itemId));
}

const CartItem = ({ item, dispatch, cart, isAdmin }) => {
    return (
        <tr>
            <td className='product-img'>
                <img src={item.images[0].url} alt={item.title}
                    className="img-thumbnail w-100"
                    style={{ minWidth: '70px', height: '70px' }} />
            </td>
            <td className="product-row w-50 align-middle" >
                <h5 className="text-capitalize text-secondary">
                    <Link href={`/product/${item._id}`}>
                        <a className='product-title'>{item.title}</a>
                    </Link>
                </h5>
                <p className="item-price">₹{`${item.totalPrice} x ${item.quantity} = ${item.quantity * item.totalPrice}`}</p>
                {
                    item.inStock > 0
                        ? <p className="mb-1 text-success">In Stock {isAdmin ? ":" + item.inStock : ""}</p>
                        : <p className="mb-1 text-danger">Out Of Stock</p>
                }
            </td>
            <td className="product-quantity align-middle">
                <button className="btn btn-outline-secondary"
                    onClick={() => dispatch(decrease(cart, item._id))}
                    disabled={item.quantity === 1 ? true : false} > - </button>
                <span className="px-2">{item.quantity}</span>
                <button className="btn btn-outline-secondary"
                    onClick={() => plusProductCountClick(cart, item._id, item.quantity, dispatch)}
                >
                    +
                </button>
                <i className="product-delete far fa-trash-alt text-danger" aria-hidden="true"
                    data-toggle="modal" data-target="#confirmModal"
                    onClick={() => dispatch({
                        type: 'ADD_MODAL',
                        payload: {
                            data: cart,
                            id: item._id,
                            title: item.title,
                            content: 'Do you want to delete this item?',
                            type: 'ADD_CART'
                        }
                    })} >
                </i>
            </td>
        </tr>
    )
}

export default CartItem