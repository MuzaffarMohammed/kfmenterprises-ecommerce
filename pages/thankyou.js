const thankYou = () => {
    return (
        <div className='thank-you'>
            <i className=" tick-circle far fa-check-circle" style={{}} aria-hidden='true'></i>
            <br></br>
            <br></br>
            <label className="text-success order-placed">Order Placed! Thank you for shopping with us</label><br></br>
            <i className="fas fa-envelope position-relative" aria-hidden='true'></i> <label className="notify-mail">  Notification mail has been sent to your registered mail address.</label>
            <br></br>
            <a href='/' className='shop-more'>
                Continue Shopping <i className="fas fa-shopping-cart" aria-hidden='true'></i>
            </a>.
            <br></br>

        </div>
    )
}

export default thankYou