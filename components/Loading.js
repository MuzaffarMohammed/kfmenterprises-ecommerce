import React from "react"

const Loading = () => {
    return (
        <React.Fragment>
            <div className='spinner-body'>
            </div>
            <div className='spinner'>
            </div>
            <div className='text-spinner'>
                <p>Processing, please wait..</p>
            </div>
        </React.Fragment>
    )
}

export default Loading