import React from "react"

const Loading = (props) => {
    return (
        <React.Fragment>
            <div className='spinner-body'>
            </div>
            <div className='spinner'>
            </div>
            <div className='text-spinner'>
                {props.isPay && <i className="fas fa-shipping-fast payment-loading-icon"></i>}
                <p>{props.msg ? props.msg : 'Processing, please wait...'}</p>
            </div>
        </React.Fragment>
    )
}

export default Loading