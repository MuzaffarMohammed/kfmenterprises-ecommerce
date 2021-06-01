import Head from 'next/head'
import { useContext, useState, useEffect } from 'react'
import { DataContext } from '../store/GlobalState'
import CartItem from '../components/CartItem'
import Link from 'next/link'
import { getData, postData } from '../utils/fetchData'
import { useRouter } from 'next/router'


const Cart = () => {
  const { state, dispatch } = useContext(DataContext)
  const { cart, auth, orders } = state

  const [total, setTotal] = useState(0)

  const [address, setAddress] = useState('')
  const [mobile, setMobile] = useState('')

  const [callback, setCallback] = useState(false)
  const router = useRouter()

  useEffect(() => {
    console.log('Init : ', state)
    console.log('mobile : ', mobile)
    console.log('address : ', address)

  },[])
  useEffect(() => {
    const getTotal = () => {
      const res = cart.reduce((prev, item) => {
        return prev + (item.totalPrice * item.quantity)
      },0)

      setTotal(res)
    }

    getTotal()
  },[cart])

  useEffect(() => {
    const cartLocal = JSON.parse(localStorage.getItem('__next__cart01'))
    if(cartLocal && cartLocal.length > 0){
      let newArr = []
      const updateCart = async () => {
        for (const item of cartLocal){
          const res = await getData(`product/${item._id}`)
          const { _id, title, images, totalPrice, inStock, sold } = res.product
          if(inStock > 0){
            newArr.push({ 
              _id, title, images, totalPrice, inStock, sold,
              quantity: item.quantity > inStock ? 1 : item.quantity
            })
          }
        }
        dispatch({ type: 'ADD_CART', payload: newArr })
      }

      updateCart()
    } 
  },[callback])

  const handlePayment = async () => {
    const numRegex = /^[0-9]+$/;
    if(!address || !mobile) return dispatch({ type: 'NOTIFY', payload: {error: 'Please add your address and mobile.'}})
    if(!(address.length >= 20)) return dispatch({ type: 'NOTIFY', payload: {error: 'Please add complete address (Flat No./H No./Door No. , Street, Locality, Area, City, State, Country, followed by pincode. ).'}})
    if(!(numRegex.test(mobile)) || !(mobile.length >= 10)) return dispatch({ type: 'NOTIFY', payload: {error: 'Please enter a valid mobile number.'}})

    let newCart = [];
    for(const item of cart){
      const res = await getData(`product/${item._id}`)
      if(res.product.inStock - item.quantity >= 0){
        newCart.push(item)
      }
    }
    
    if(newCart.length < cart.length){
      setCallback(!callback)
      return dispatch({ type: 'NOTIFY', payload: {
        error: 'The product is out of stock or the quantity is insufficient.'
      }})
    }

    dispatch({ type: 'NOTIFY', payload: {loading: true} })
    postData('order', {address, mobile, cart, total}, auth.token)
    .then(res => {
      if(res.err) return dispatch({ type: 'NOTIFY', payload: {error: res.err} })
      const newOrder = {
        ...res.newOrder,
        user: auth.user
      }
      dispatch({ type: 'ADD_ORDERS', payload: [...orders, newOrder] })
      return router.push(`/order/${res.newOrder._id}`)
    })

  }
  
  if(cart.length === 0){
    return (
            <div className='text-alingn-center'>
              <div style={{ position:'absolute', top: '35%', left: '50%', transform: 'translate(-50%, -50%)'}}>
               Sorry, your <i className="fas fa-shopping-cart position-relative" aria-hidden="true"></i>cart is empty. Please add an item to place an order : <a href='/' style={{fontSize:'16px', fontWeight:'800'}}>
               Continue Shopping <i className="fas fa-home" aria-hidden="true" ></i></a>.
              </div>
            </div>
          )
  }

    return(
      <div className="container row mx-auto">
        <Head>
          <title>KFM Cart - Cart Page</title>
        </Head>
        <h2 className="container text-uppercase mt-3" >Shopping Cart</h2>
        <div className="col-md-6 text-secondary table-responsive my-3 colHeight">
      
          <table className="table my-3">
            <tbody>
              {
                cart.map(item => (
                  <CartItem key={item._id} item={item} dispatch={dispatch} cart={cart} isAdmin={auth && auth.user && auth.user.role === 'admin'}/>
                ))
              }
            </tbody>
          </table>
        </div>

        <div className="col-md-5 my-3 text-left text-uppercase text-secondary cartitem-border">
            <form>
              <h2>Shipping</h2>

              <label htmlFor="address">Address</label>
              <input type="text" name="address" id="address"
              className="form-control mb-2" value={address}
              onChange={e => setAddress(e.target.value)} />

              <label htmlFor="mobile">Mobile</label>
              <input type="text" name="mobile" id="mobile"
              className="form-control mb-2" value={mobile}
              onChange={e => setMobile(e.target.value)} />
            </form>

            <h3>Total: <span className="text-danger">₹{total}</span></h3>

            
            <Link href={auth.user ? '#!' : '/signin'}>
              <a className="btn btn-dark my-2 cartPayBtn" onClick={handlePayment}>Proceed to pay</a>
            </Link>
            
        </div>
      </div>
    )
  }
  
export default Cart