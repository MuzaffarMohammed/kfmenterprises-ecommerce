
const ShippingDetails = (props) => {
    return (
        <>
            <div className="row order-step-header">
                <h6>Shipping Details</h6>
            </div>

            <div className="pt-3">
                <label style={{ fontSize: '14px' }} className="font-weight-bold text-black"> {props.order.address.fullName}</label><br />
                <p >
                    <span style={{ wordWrap: 'break-word' }}>
                        {props.order.address.address},<br />
                        {props.order.address.city}, {props.order.address.countryState},<br />
                        {props.order.address.country}, {props.order.address.pincode}.<br />
                        Phone number: {props.order.address.phoneNumber}.
                    </span>
                </p>
            </div>
        </>
    )
}
export default ShippingDetails