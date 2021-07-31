import Head from 'next/head'
import Link from 'next/link'
import { postData } from '../utils/fetchData'
import { useState, useContext } from 'react'
import { DataContext } from '../store/GlobalState'
import moment from 'moment';
import os  from "os";
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

    //return console.log('Testing...', os.hostname(), os.type(), os.platform())


    dispatch({ type: 'NOTIFY', payload: { loading: true } })

    const res = await postData('auth/checkUserExist', userDataRecovery)

    if (res.err) return dispatch({ type: 'NOTIFY', payload: { error: res.err } })
    if (res && res.user && !res.user.activated) return dispatch({ type: 'NOTIFY', payload: { error: 'Please activate your account to proceed further.' } })

    const resMail = await postData(
      'mail',
      {
        forgotPasswordUrl: process.env.NEXT_PUBLIC_BASE_URL + `/resetPassword?userid=${res.user.id}&ts=${moment().valueOf()}`,
        email: accountRecoveryEmail,
        mailType: PASSWORD_RESET_MAIL,
        subject: 'Password Reset Request',
        userName: res.user.name,
        hostName: os.hostname(),
        type: os.type()
      }
    )
    if (resMail.err) return dispatch({ type: 'NOTIFY', payload: { error: "Sorry, something went wrong! Please try again." } })

    return dispatch({ type: 'NOTIFY', payload: { success: "We have successfully sent a password reset mail to your verified email address. Please check your mail inbox." } })
  }

  return (
    <div className="container-fluid">
      <Head>
        <title>KFM Cart - Forgot Password</title>
      </Head>

      <form className="container-fluid mx-auto my-4 border_login" style={{ maxWidth: '500px' }} onSubmit={handleSubmit}>
        <h1>Find Your Account</h1>

        <p>Please enter your email address.</p>
        <div className="form-group">
          {/* <label htmlFor="userName">Email Address</label> */}
          <input type="email" className="form-control" id="exampleAccountRecoveryEmail" aria-describedby="emailHelp"
            name="accountRecoveryEmail" value={accountRecoveryEmail} onChange={handleChangeInput} placeholder="example@gmail.com" />
        </div>

        <button type="submit" className="btn btn-dark signBtn w-100">Submit</button>

        <p className="my-2">
          You don't have an account? <Link href="/register"><a style={{ color: '#2196f3' }}>Register Now</a></Link>
        </p>

      </form>
    </div>
  )
}

export default ForgotPassword