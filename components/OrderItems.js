import Link from 'next/link'

const OrderItems =(props)=>{
return(
    <div className="border_login col-xl-6 orderItemsCard">
<h6>Items</h6>
            {
                props.order.cart.map(item => (
                    <div className="row border-bottom mx-0 p-4 justify-content-betwenn
                                        align-items-center orderInfoFontSize" key={item._id} style={{ maxWidth: '550px' }}>
                        <img src={item.images[0].url} alt={item.images[0].url}
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
            <h5 className="my-4 text-uppercase col-xl-12">Total: ₹{props.order.total}.00</h5>
            </div>
)
}
export default OrderItems