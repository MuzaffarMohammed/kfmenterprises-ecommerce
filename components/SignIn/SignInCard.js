import Link from 'next/link'
import { useState, useContext, useEffect } from 'react'
import Cookie from 'js-cookie'
import { useRouter } from 'next/router'
import { DataContext } from '../../store/GlobalState'
import { postData } from '../../utils/fetchData'
import Loading from '../Loading'


export default function SignInCard(props) {

    const initialState = { userName: '', password: '' }
    const [userData, setUserData] = useState(initialState)
    const { userName, password } = userData
    const { state, dispatch } = useContext(DataContext)
    const [isLoading, setIsLoading] = useState(false)

    const handleChangeInput = e => {
        const { name, value } = e.target
        setUserData({ ...userData, [name]: value })
        dispatch({ type: 'NOTIFY', payload: {} })
    }

    const handleSubmit = async e => {
        e.preventDefault()
        setIsLoading(true);
        try {
            if (!userData) return dispatch({ type: 'NOTIFY', payload: { error: 'Something went wrong! Please try again.' } })
            if (!userData.userName) return dispatch({ type: 'NOTIFY', payload: { error: "Please enter a 'User Name'." } })
            if (!userData.password) return dispatch({ type: 'NOTIFY', payload: { error: "Please enter a 'Password'." } })

            const res = await postData('auth/login', userData)
            if (res.err) throw res.err;
            dispatch({ type: 'NOTIFY', payload: { success: res.msg, delay: 1000 } })
            dispatch({ type: 'AUTH', payload: { token: res.access_token, user: res.user } })

            Cookie.set('refreshtoken', res.refresh_token, {
                path: 'api/auth/accessToken',
                expires: 7,//7 days
                secure: process.env.NEXT_PUBLIC_HOSTNAME !== 'localhost',
                sameSite: 'Lax'
            })

            Cookie.set('firstLogin', true, {
                path: '/',
                expires: 15 / 1440,//15 minutes
                secure: process.env.NEXT_PUBLIC_HOSTNAME !== 'localhost',
                sameSite: 'Lax'
            })
            setIsLoading(false);
            $('#confirmModal').modal('hide');
        } catch (err) {
            setIsLoading(false);
            return dispatch({ type: 'NOTIFY', payload: { error: err } })
        }
    }

    return (
        <>
            {isLoading && <Loading msg='Signing in, please wait...' />}
            <div className="container-fluid">
                <form className="container-fluid mx-auto my-4 shadow-card" style={{ maxWidth: '500px' }} onSubmit={handleSubmit}>
                    <h1>Sign in</h1>
                    <div className="form-group">
                        <label htmlFor="userName">User Name</label>
                        <input type="text" className="form-control" id="userName" aria-describedby="userNameHelp"
                            name="userName" value={userName} onChange={handleChangeInput} maxLength='100' autocomplete="off"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="exampleInputPassword1">Password</label>
                        <input type="password" className="form-control" id="exampleInputPassword1"
                            name="password" value={password} onChange={handleChangeInput} maxLength='64' autocomplete="off"/>
                    </div>
                    <button type="submit" className="btn btn-primary signBtn w-100">Sign in</button>
                    <small id="userNameHelp" className="form-text text-muted pt-1">Note: We'll never share your credentials with anyone else.</small>

                    <p className="my-2">
                        You don't have an account? <Link href="/register"><a style={{ color: '#2196f3' }}>Create Your Account</a></Link>
                    </p>
                    <p className="my-2">
                        <Link href="/forgotPassword"><a style={{ color: '#2196f3' }}>Forgot Password?</a></Link>
                    </p>
                </form>
            </div>
        </>

    );
}