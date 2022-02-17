import Head from 'next/head'
import Link from 'next/link'
import { postData } from '../utils/fetchData'
import { useState, useContext } from 'react'
import { DataContext } from '../store/GlobalState'
import moment from 'moment';
import os from "os";
import { PASSWORD_RESET_MAIL } from '../utils/constants.js'

const ForgotPassword = () => {
  const initialState = { userName: '', accountRecoveryEmail: '' }
  const [userDataRecovery, setuserDataRecovery] = useState(initialState)
  const { userName, accountRecoveryEmail } = userDataRecovery

  const { dispatch } = useContext(DataContext)

  const handleChangeInput = e => {
    const { name, value } = e.target

    setuserDataRecovery({ ...userDataRecovery, [name]: value })
    dispatch({ type: 'NOTIFY', payload: {} })
  }

  const handleSubmit = async e => {
    console.log("accountRecoveryEmail :", accountRecoveryEmail)
    e.preventDefault();
    dispatch({ type: 'NOTIFY', payload: { loading: true } })

    const res = await postData('auth/forgotPassword',
      {
        email: userDataRecovery && userDataRecovery.accountRecoveryEmail,
        hostName: os.hostname(),
        hostType: os.type()
      })
    if (res.err) return dispatch({ type: 'NOTIFY', payload: { error: res.err } })
    if (res.success) return dispatch({ type: 'NOTIFY', payload: { success: "We have successfully sent a password reset mail to your verified email address. Please check your mail inbox.", delay: 10000 } })
  }

  return (
    <div className="container-fluid">
      <Head>
        <title>KFM Cart - Forgot Password</title>
      </Head>
      <form className="container-fluid mx-auto my-4 shadow-card" style={{ maxWidth: '500px' }} onSubmit={handleSubmit}>
        <h1>Find Your Account</h1>
        <p>Please enter your email address.</p>
        <div className="form-group">
          <input type="email" className="form-control" id="exampleAccountRecoveryEmail" aria-describedby="emailHelp" maxLength='100'
            name="accountRecoveryEmail" value={accountRecoveryEmail} onChange={handleChangeInput} placeholder="example@gmail.com" />
        </div>
        <button type="submit" className="btn btn-primary signBtn w-100">Submit</button>
        <p className="my-2">
          You don't have an account? <Link href="/register"><a style={{ color: '#2196f3' }}>Create Your Account</a></Link>
        </p>
      </form>
    </div>
  )
}

export default ForgotPassword