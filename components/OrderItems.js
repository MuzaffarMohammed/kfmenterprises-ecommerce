import Link from 'next/link'

const OrderItems = (props) => {
    return (
        <div className="container border_login col-xl-7 orderItemsCard">
            <h5>3. Items</h5>
            {
                props.order.cart.map(item => (
                    <div className="row border-bottom mx-0 p-4 justify-content-between
                                        align-items-center orderInfoFontSize" key={item._id}>
                        <img src={item.images[0].url}
                            style={{ width: '50px', height: '45px', objectFit: 'cover' }} />
                        <div className="flex-fill font-weight-normal px-3 m-0">
                            <Link href={`/product/${item._id}`}>
                                <a>{item.title}</a>
                            </Link>
                        </div>
                        <br></br>
                        <span className="text-info mt-2">
                            {item.quantity} x ₹{item.totalPrice} = ₹{item.totalPrice * item.quantity}
                        </span>
                    </div>
                ))
            }
            <div className="row justify-content-end">
                <h5 className="my-4 text-uppercase">Total= ₹{props.order.total}.00</h5>
            </div>
        </div>
    )
}
export default OrderItems