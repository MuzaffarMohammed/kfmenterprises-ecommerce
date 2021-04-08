import React from 'react'
import './loading.css';
import loading from './loading.gif'

function Loading() {
    return (
        <div className="load-page">
            <div className="loader">
                <img src={loading}></img>
            </div>
        </div>
    )
}

export default Loading
