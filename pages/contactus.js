import Head from 'next/head'
import {useState, useContext} from 'react'
import {DataContext} from '../store/GlobalState'
import {postData} from '../utils/fetchData'
import { useRouter } from 'next/router'
import { CONTACT_MAIL } from '../utils/constants.js'

const ContactUs = () => {
  const initialState = {contName: '', contEmail: '', phoneNumber: '', message: '' }
  const [userData, setUserData] = useState(initialState)
  const { contName, contEmail, phoneNumber, message } = userData

  const {state, dispatch} = useContext(DataContext)
  const { auth } = state

  const router = useRouter()

  const handleChangeInput = e => {
    const {name, value} = e.target
    setUserData({...userData, [name]:value})
    dispatch({ type: 'NOTIFY', payload: {} })
  }

   
  const handleSubmit = async e => {
      e.preventDefault()
      dispatch({ type: 'NOTIFY', payload: {loading: true} })
      const { contName: userName , contEmail : email, phoneNumber, message } = userData
      const res = await postData('mail', {userName, email, phoneNumber, message, mailType: CONTACT_MAIL, subject: 'Contact form request'})
      if(res.err) return dispatch({ type: 'NOTIFY', payload: {error: "Sorry, something went wrong! Please try again."} })
      return dispatch({ type: 'NOTIFY', payload: {success: "Mail sent! Thank you for contacting us, we will get back to you shortly."} })
  }

  // useEffect(() => {
  //   if(Object.keys(auth).length !== 0) router.push("/")
  // }, [auth])

    return(
      <div className="container-fluid">
        <Head>
          <title>KFM Cart - Contact Us</title>
        </Head>

        <form className="container mx-auto my-4 shadow-card contform" onSubmit={handleSubmit}>
          <h2>LET’S GET IN TOUCH</h2>
          <div className="row">
          <div className="col-xl-5 contact">
          <div>
            <i className="fa fa-map-marker"></i>
            <strong>ADDRESS</strong>
            <p>Nawab Sahab Kunta, Jahanuma, Mir Alam Talab,Hyderabad, Telangana, India, 500053</p>
          </div>
             <hr className="dashed"/>
          <div>
            <i className="fa fa-phone sty" ></i>
            <strong>NUMBER</strong>
            <p><a href="tel:+918247732147">+91 8247732147</a></p>
          </div>
              <hr className="dashed"/>
          <div>
            <i className="fa fa-envelope"></i>
            <strong>EMAIL</strong>
            <p><a href="mailto:kfmcart@gmail.com">kfmcart@gmail.com</a></p>
          </div>
          </div>
          <div className="col-xl-6">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input type="text" className="form-control" id="name" maxLength='25'
            name="contName" value={contName} onChange={handleChangeInput} />
          </div>

          <div className="form-group">
            <label htmlFor="exampleInputEmail1">Email address</label>
            <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"
            name="contEmail" value={contEmail} onChange={handleChangeInput} maxLength='100'/>
            <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
          </div>

          <div className="form-group">
            <label htmlFor="exampleInputPassword1">Phone Number</label>
            <input type="number" className="form-control" id="phonenumber"
            name="phoneNumber" value={phoneNumber} onChange={handleChangeInput} maxLength='15'/>
          </div>

          <div className="form-group">
            <label htmlFor="exampleInputPassword2">Message</label>
            <textarea type="text" className="form-control" id="message"
            name="message" value={message}  onChange={handleChangeInput} maxLength='250'/>
          </div>
          
          <button type="submit" className="btn btn-success signBtn w-100">Send Message</button>
        </div>
          </div>
        </form>
      </div>
    )
  }
  
  export default ContactUs