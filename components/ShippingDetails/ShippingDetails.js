
const ShippingDetails = (props) => {
    return (
        <>
            <div className="row order-step-header">
                <h6>Shipping Details</h6>
            </div>
            <div>
                <p style={{ marginTop: '10px' }}>{props.order.user.name}</p>
                <p style={{ wordWrap: 'break-word' }}>{props.order.address}</p>
                <p style={{ wordWrap: 'break-word' }}>{props.order.user.email}</p>
                <p style={{ wordWrap: 'break-word' }}>{props.order.mobile}</p>
            </div>
        </>
    )
}
export default ShippingDetails