import Head from 'next/head'
import Link from 'next/link'
import {postData} from '../utils/fetchData'
import {useState, useContext} from 'react'
import {DataContext} from '../store/GlobalState'
import moment from 'moment'

import { PASSWORD_RESET_MAIL } from '../utils/constants.js'

const ForgotPassword = () => {
  const initialState = {userName:'', accountRecoveryEmail: '' }
  const [userDataRecovery, setuserDataRecovery] = useState(initialState)
  const { userName, accountRecoveryEmail } = userDataRecovery

  const { dispatch} = useContext(DataContext)
  
    const handleChangeInput = e => {
    const {name, value} = e.target
   
    setuserDataRecovery({...userDataRecovery, [name]:value})
    dispatch({ type: 'NOTIFY', payload: {} })
  } 
   
    const handleSubmit = async e => {
      console.log("accountRecoveryEmail :"+accountRecoveryEmail )
      e.preventDefault()
      dispatch({ type: 'NOTIFY', payload: {loading: true} })
      
      const res = await postData('auth/checkUserExist', userDataRecovery)
      if(res.err) return dispatch({ type: 'NOTIFY', payload: {error: res.err} })
      dispatch({ type: 'NOTIFY', payload: {success: res.msg} })
      
      const User = res.user.name
      console.log("UserName : "+ User) 
      
      
       const date = moment().valueOf();
      
      if(res && res.user && !res.user.activated) return dispatch({type: 'NOTIFY', payload: {error: 'Please activate your account to proceed further.'}})
      const resMail = await postData('mail', {forgotPasswordUrl: process.env.NEXT_PUBLIC_BASE_URL+`/resetPassword?userid=${res.user.id}&ts=${date}`,email:accountRecoveryEmail, mailType: PASSWORD_RESET_MAIL, subject: 'Password Reset Request', userName:User})
      if(resMail.err) return dispatch({ type: 'NOTIFY', payload: {error: "Sorry, something went wrong! Please try again."} })
      return dispatch({ type: 'NOTIFY', payload: {success: "Mail sent! Reset Password link."} })
    }
    
    return(
        <div className="container-fluid">
          <Head>
            <title>KFM Cart - Forgot Password</title>
          </Head>
  
          <form className="container-fluid mx-auto my-4 border_login" style={{maxWidth: '500px'}} onSubmit={handleSubmit}>
          <h1>Find Your Account</h1>

          <p>Please enter your email address or username to search for your account.</p>
            <div className="form-group">
              <label htmlFor="userName">User Name</label>
              <input type="email" className="form-control" id="exampleAccountRecoveryEmail" aria-describedby="emailHelp"
            name="accountRecoveryEmail" value={accountRecoveryEmail} onChange={handleChangeInput} />
            </div>
            
            <button type="submit" className="btn btn-dark signBtn w-100">Submit</button>
  
            <p className="my-2">
              You don't have an account? <Link href="/register"><a style={{color: '#2196f3'}}>Register Now</a></Link>
            </p>
            
          </form>
        </div>
      )
}

export default ForgotPassword