import Head from 'next/head'
import Link from 'next/link'
import { useState, useContext, useEffect } from 'react'
import { valid } from '../utils/valid'
import { DataContext } from '../store/GlobalState'
import { postData } from '../utils/fetchData'
import { useRouter } from 'next/router'


const Register = () => {
  const initialState = { name: '', email: '', password: '', cf_password: '' }
  const [userData, setUserData] = useState(initialState)
  const { name, email, password, cf_password } = userData

  const { state, dispatch } = useContext(DataContext)
  const { auth } = state

  const router = useRouter()

  const handleChangeInput = e => {
    const { name, value } = e.target
    setUserData({ ...userData, [name]: value })
    dispatch({ type: 'NOTIFY', payload: {} })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    const errMsg = valid(name, email, password, cf_password)
    if (errMsg) return dispatch({ type: 'NOTIFY', payload: { error: errMsg } })

    dispatch({ type: 'NOTIFY', payload: { loading: true } })

    const res = await postData('auth/register', userData)

    if (res.err) return dispatch({ type: 'NOTIFY', payload: { error: res.err } })

    return dispatch({ type: 'NOTIFY', payload: { success: res.msg } })
  }

  useEffect(() => {
    if (Object.keys(auth).length !== 0) router.push("/")
  }, [auth])

  return (
    <div className="container-fluid">
      <Head>
        <title>KFM Cart - Register</title>
      </Head>

      <form className="container-fluid mx-auto my-4 shadow-card" style={{ maxWidth: '500px' }} onSubmit={handleSubmit}>
        <h1>Create Account</h1>
        <div className="form-group">
          <label htmlFor="name">User Name</label>
          <input type="text" className="form-control" id="name"
            name="name" value={name} onChange={handleChangeInput} maxLength='100' />
        </div>

        <div className="form-group">
          <label htmlFor="exampleInputEmail1">Email address</label>
          <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"
            name="email" value={email} onChange={handleChangeInput} maxLength='100' />
        </div>

        <div className="form-group">
          <label htmlFor="exampleInputPassword1">Password</label>
          <input type="password" className="form-control" id="exampleInputPassword1"
            name="password" maxLength='64' value={password} onChange={handleChangeInput} />
        </div>

        <div className="form-group">
          <label htmlFor="exampleInputPassword2">Confirm Password</label>
          <input type="password" className="form-control" id="exampleInputPassword2"
            name="cf_password" maxLength='64' value={cf_password} onChange={handleChangeInput} />
        </div>

        <button type="submit" className="btn btn-primary signBtn w-100">Register</button>
        <small id="emailHelp" className="form-text text-muted">We never share your credentials with anyone else.</small>

        <p className="my-2">
          Already have an account? <Link href="/signin"><a style={{ color: 'crimson' }}>Sign in</a></Link>
        </p>
      </form>
    </div>
  )
}

export default Register