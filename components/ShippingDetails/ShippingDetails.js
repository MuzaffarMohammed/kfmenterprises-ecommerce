
const ShippingDetails = (props) => {
    return (
    <div className="border_login col-xl-5 shippingDetailsFont shippingDetailsCard" style={{ }}>
    <h5>Shipping Details</h5>
    <p style={{ marginTop: '25px' }}>{props.order.user.name}</p>
    <p>{props.order.address}</p>
    <p>{props.order.user.email}</p>
    <p>{props.order.mobile}</p>
</div>)
}
export default ShippingDetails