
const ShippingDetails = (props) => {
    return (
        <div className="border_login col-xl-4 shippingDetailsFont shippingDetailsCard">
            <h5>2. Shipping Details</h5>
            <p style={{ marginTop: '10px' }}>{props.order.user.name}</p>
            <p style={{ wordWrap: 'break-word' }}>{props.order.address}</p>
            <p>{props.order.user.email}</p>
            <p>{props.order.mobile}</p>
        </div>)
}
export default ShippingDetails