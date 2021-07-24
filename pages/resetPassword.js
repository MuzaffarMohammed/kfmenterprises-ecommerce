import Head from 'next/head'
import { useState, useContext } from 'react'
import { DataContext } from '../store/GlobalState'
import { resetPwdValidation } from '../utils/valid'
import { patchData } from '../utils/fetchData'
import { useRouter } from 'next/router'
import moment from 'moment'


const ResetPassword = (props) => {
    const router = useRouter()
    const oldTime = props.query.ts;
    const newTime = moment().valueOf();

    const previousDate = moment.unix(oldTime / 1000);
    const newDate = moment.unix(newTime / 1000);

    let minutesDiff = newDate.diff(previousDate, 'minutes');
    console.log('Minutes:' + minutesDiff);

   
    const initialSate = {
        password: '',
        cf_password: ''
    }
    const [data, setData] = useState(initialSate)
    const { password, cf_password } = data

    const { state, dispatch } = useContext(DataContext)
    const { notify } = state
    
    const userid = props.query.userid

    if (minutesDiff > 20) return false
    console.log("USERID :", userid);
    // useEffect(() => {
    //     if(auth.user) setData({...data, name: auth.user.name})
    // },[auth.user])

    const handleChange = (e) => {
        const { name, value } = e.target
        setData({ ...data, [name]: value })
        dispatch({ type: 'NOTIFY', payload: {} })
    }

    const handleUpdateProfile = e => {
        e.preventDefault()
        if (password) {
            const errMsg = resetPwdValidation(password, cf_password)
            if (errMsg) return dispatch({ type: 'NOTIFY', payload: { error: errMsg } })
            updatePassword()
        }
    }

    const updatePassword = () => {
        dispatch({ type: 'NOTIFY', payload: { loading: true } })
        patchData('user/resetPassword', { password, urlPwdResetFlag: true, userid }, undefined)
            .then(res => {
                if (res.err) return dispatch({ type: 'NOTIFY', payload: { error: res.err } })
                dispatch({ type: 'NOTIFY', payload: { success: res.msg } })
                return router.push('/')
            })
    }

    const handleSubmit = async e => { }


    // if(!auth.user) return null;
    return (
        <div className="profile_page ">
            <Head>
                <title>KFM Cart - Account recovery</title>
            </Head>

            <form className="container-fluid mx-auto my-4 border_login" style={{ maxWidth: '500px' }} onSubmit={handleSubmit}>
                <h1>Reset Password</h1>
                <p>Please enter your new password.</p>
                <section>
                    <div className="userProfileCol">
                        <h3 className="text-center text-uppercase">
                            {/* {auth.user.role === 'user' ? 'User Profile' : 'Admin Profile'} */}
                        </h3>

                        <div className="form-group">
                            <label htmlFor="password">New Password</label>
                            <input type="password" name="password" value={password} className="form-control"
                                placeholder="Your new password" onChange={handleChange} />
                        </div>

                        <div className="form-group">
                            <label htmlFor="cf_password">Confirm New Password</label>
                            <input type="password" name="cf_password" value={cf_password} className="form-control"
                                placeholder="Confirm new password" onChange={handleChange} />
                        </div>

                        <button className="btn btn-dark w-100 signBtn" disabled={notify.loading}
                            onClick={handleUpdateProfile}>
                            Update
                        </button>
                    </div>

                </section>
            </form>
        </div>
    )
}


export async function getServerSideProps({ query }) {
    // server side rendering
    return {
        props: { query: query }, // will be passed to the page component as props
    }
}


export default ResetPassword