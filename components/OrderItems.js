import Link from 'next/link'

const OrderItems = (props) => {
    return (
        <>
            <div className="row order-step-header">
                <h6>Items</h6>
            </div>
            {
                props.order.cart.map(item => (
                    <div className="row border-bottom mx-0 pt-4 pb-1 justify-content-between
                                        align-items-center orderInfoFontSize" key={item._id}>
                        <img src={item.images[0].url}
                            style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
                        <div className="flex-fill font-weight-normal px-3 m-0">
                            <Link href={`/product/${item._id}`}>
                                <a style={{ wordWrap: 'break-word' }}>{item.title}</a>
                            </Link>
                            <div className="flex-fill m-0">
                                <label>
                                    ₹{item.totalPrice} x {item.quantity}
                                </label>
                            </div>
                        </div>

                        <span className="item-price mt-2">
                            ₹{item.totalPrice * item.quantity}
                        </span>
                    </div>
                ))
            }
            <div className="row justify-content-end">
                <h6 className=" item-price my-4 text-uppercase">₹{props.order.total}.00</h6>
            </div>
        </>
    )
}
export default OrderItems