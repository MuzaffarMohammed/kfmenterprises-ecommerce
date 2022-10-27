import React, { useContext, useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { DataContext } from '../store/GlobalState'
import { postData, putData } from '../utils/fetchData'
import Cookie from 'js-cookie'
import { ACC_ACT_MAIL } from '../utils/constants.js'
import isEmpty from 'lodash/isEmpty';
import MenuNotifications from './Notifications/MenuNotifications'

function NavBar() {
    const router = useRouter()
    const { state, dispatch } = useContext(DataContext)
    const { auth, cart } = state
    const [accountActivated, setAccountActivated] = useState(auth && auth.user && auth.user.activated)
    const isAdmin = auth && auth.user && auth.user.role === 'admin';

    const isActive = (r) => { return r === router.pathname ? " active" : "" }

    const handleLogout = async () => {
        const res = await putData(`auth/logout`, {}, auth.token)
        if (res.err) return dispatch({ type: 'NOTIFY', payload: { error: res.err } })
        Cookie.remove('refreshtoken', { path: 'api/auth/accessToken' })
        Cookie.remove('firstLogin', { path: 'api/auth/accessToken' })
        dispatch({ type: 'AUTH', payload: {} })
        dispatch({ type: 'NOTIFY', payload: { success: res.msg } })
        setAccountActivated(null)
        return router.push('/')
    }

    const adminRouter = () => {
        return (
            <>
                <Link href="/users">
                    <a className="dropdown-item">Users</a>
                </Link>
                <Link href="/products">
                    <a className="dropdown-item">Products
                    </a>
                </Link>
                <Link href="/create">
                    <a className="dropdown-item">Add Product
                    </a>
                </Link>
                <Link href="/categories">
                    <a className="dropdown-item">Categories</a>
                </Link>
            </>
        )
    }

    const loggedRouter = () => {
        return (
            <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <img className="my-account" src={auth.user.avatar} alt={auth.user.avatar} />
                    {auth.user.name}
                </a>

                <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                    <Link href="/profile">
                        <a className="dropdown-item">Profile</a>
                    </Link>
                    {
                        auth.user.role === 'admin' && adminRouter()
                    }
                    <Link href="/orders">
                        <a className="dropdown-item">Orders</a>
                    </Link>
                    <Link href="/notifications">
                        <a className="dropdown-item">Notifications</a>
                    </Link>
                    <div className="dropdown-divider"></div>
                    <button className="dropdown-item" onClick={handleLogout}>Logout</button>
                </div>
            </li>
        )
    }

    useEffect(() => {
        if (auth && auth.user && !auth.user.activated) {
            setAccountActivated(false)
        }
    }, [auth])

    const triggerAccountActivationMail = () => {
        if (auth && auth.user && auth.user.email) {
            postData('mail', { userName: auth.user.name, email: auth.user.email, id: auth.user.id, mailType: ACC_ACT_MAIL, subject: 'Account Activation Request' }, auth.token)
            dispatch({ type: 'NOTIFY', payload: { success: "An activation link has been sent to your registered mail address, please activate your account for full access.", delay: 12000 } })
        }
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
            <Link href="/">
                <div className="d-flex align-items-end mb-0" style={{ cursor: 'pointer' }}>
                    <img src="/assets/images/icon/KFM_Logo_Small_Black.svg" alt="KFM Enterprises" />
                    <h4 className='company-logo'>CART</h4>
                    <i className="fas fa-shopping-cart position-relative cart-logo" aria-hidden="true"></i>
                </div>
            </Link>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse justify-content-end" id="navbarNavDropdown">
                {accountActivated === false &&
                    <button onClick={() => { triggerAccountActivationMail() }} className="btn btn-warning activateBtn">Activate Your Account</button>
                }

                <ul className="navbar-nav p-1">
                    <li className="nav-item" >
                        <Link href="/">
                            <a className={"nav-link" + isActive('/')}>
                                <i className="fas fa-home" aria-hidden="true" ></i> Home
                            </a>
                        </Link>
                    </li>
                    {isAdmin &&
                        <li className="nav-item" >
                            <Link href="/dashboard">
                                <a className={"nav-link" + isActive('/dashboard')}>
                                    <i className="fas fa-th" aria-hidden="true" ></i> Dashboard
                                </a>
                            </Link>
                        </li>
                    }
                    <li className="nav-item" style={{ display: `${isAdmin ? 'none' : 'block'}` }}>
                        <Link href="/cart">
                            <a className={"nav-link" + isActive('/cart')}>
                                <i className="fas fa-shopping-cart" aria-hidden="true" >
                                    {cart && cart.length > 0 ?
                                        <>
                                            <span className="count-badge count-badge-cart">
                                                {cart.length}
                                            </span>
                                            <span className="navbar-menu-text" style={{ paddingLeft: cart.length > 9 ? '25px' : '20px' }}>Cart</span>
                                        </>
                                        :
                                        <span className="navbar-menu-text">Cart</span>
                                    }
                                </i>
                            </a>
                        </Link>
                    </li>
                    <li className="nav-item" >
                        <MenuNotifications />
                    </li>
                    {
                        isEmpty(auth)
                            ? <li className="nav-item">
                                <Link href="/signin">
                                    <a className={"nav-link" + isActive('/signin')}>
                                        <i className="fas fa-user" aria-hidden="true"></i> Sign in
                                    </a>
                                </Link>
                            </li>
                            : loggedRouter()
                    }
                </ul>
            </div>
        </nav>
    )
}

export default NavBar
