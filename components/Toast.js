const Toast = ({ msg, handleShow, bgColor }) => {
    return (
        <div className={`toast show text-light ${bgColor}`}
            style={{ position: 'fixed', top: '80px', right: '5px', zIndex: 9999, minWidth: '280px' }} data-animation="true" data-delay="1000">

            <div className={`toast-header ${bgColor} text-light`}>
                <strong className="mr-auto text-light">
                    <i className={msg.title === 'Success' ? 'fas fa-check-circle' : 'fas fa-exclamation-triangle'} style={{ opacity: '0.5' }}></i>
                </strong>

                <button type="button" className="ml-2 mb-1 close text-light"
                    data-dismiss="toast" style={{ outline: 'none' }}
                    onClick={handleShow}>x</button>
            </div>

            <div className="toast-body">{msg.msg}</div>

        </div>
    )
}

export default Toast