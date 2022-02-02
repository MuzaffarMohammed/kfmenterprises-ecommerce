import { useContext, useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { DataContext } from '../store/GlobalState'
import CartItem from '../components/CartItem'
import { getData, postData, deleteData, putData } from '../utils/fetchData'
import { deleteItem } from '../store/Actions'
import { CITIES_ARR, STATES_ARR, COUNTRIES_ARR, ONLINE } from '../utils/constants'


const Cart = () => {
  const { state, dispatch } = useContext(DataContext)
  const { cart, auth, orders } = state

  const [total, setTotal] = useState(0)

  const [city, setCity] = useState('')
  const [countryState, setCountryState] = useState('Telangana') // Need to change when more states get added
  const [country, setCountry] = useState('India')

  const [address, setAddress] = useState('')
  const [mobile, setMobile] = useState('')

  const [callback, setCallback] = useState(false)
  const router = useRouter()


  useEffect(() => {
    const getTotal = () => {
      const res = cart.reduce((prev, item) => {
        return prev + (item.totalPrice * item.quantity)
      }, 0)

      setTotal(res)
    }

    getTotal()
  }, [cart])

  useEffect(() => {
    const cartLocal = JSON.parse(localStorage.getItem('__next__cart01'))
    if (cartLocal && cartLocal.length > 0) {
      let newArr = []
      const updateCart = async () => {
        for (const item of cartLocal) {
          const res = await getData(`product/${item._id}`)
          const { _id, title, images, totalPrice, inStock, sold } = res.product
          if (inStock > 0) {
            newArr.push({
              _id, title, images, totalPrice, inStock, sold,
              quantity: item.quantity > inStock ? inStock : item.quantity
            })
          }
        }
        dispatch({ type: 'ADD_CART', payload: newArr })
      }

      updateCart()
    }
  }, [callback])

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!auth.user) return dispatch({ type: 'NOTIFY', payload: { error: 'Please sign in to proceed further!' } })

    const numRegex = /^[0-9]+$/;
    //console.log('address: ', address+' mobile: '+mobile+ ' city : '+city+ ' countryState : '+countryState+ ' country: '+country);
    if (!address || !mobile || !city || !countryState || !country) return dispatch({ type: 'NOTIFY', payload: { error: 'Please add all your details to proceed further.' } })
    if (!(address.length >= 15)) return dispatch({ type: 'NOTIFY', payload: { error: 'Please add address like (Flat No./H No./Door No. , Street, Locality, Area) only.', delay: 12000 } })
    if (city == "-Select-") return dispatch({ type: 'NOTIFY', payload: { error: 'Please select a city.' } })
    if (countryState == "-Select-") return dispatch({ type: 'NOTIFY', payload: { error: 'Please select a State.' } })
    if (country == "-Select-") return dispatch({ type: 'NOTIFY', payload: { error: 'Please select a country.' } })
    if (!(numRegex.test(mobile)) || !(mobile.length >= 10)) return dispatch({ type: 'NOTIFY', payload: { error: 'Please enter a valid mobile number.' } })

    let newCart = [];
    let nonAvailProducts = [];
    for (const item of cart) {
      const res = await getData(`product/${item._id}`)
      if (res.product.inStock - item.quantity >= 0) {
        newCart.push(item)
      } else {
        nonAvailProducts.push(item.title);
      }
    }

    if (newCart.length < cart.length) {
      setCallback(!callback)
      return dispatch({
        type: 'NOTIFY', payload: {
          error: `This Product(s) - [${nonAvailProducts.join(',')}] quantity is insufficient or out of stock.`
        }
      })
    }

    const finalAddr = formatAddress();

    dispatch({ type: 'NOTIFY', payload: { loading: true } })
    postData('order', { address: finalAddr, mobile, cart, total }, auth.token)
      .then(res => {
        if (res.err) return dispatch({ type: 'NOTIFY', payload: { error: res.err } })
        const newOrder = {
          ...res.newOrder,
          user: auth.user
        }
        dispatch({ type: 'ADD_ORDERS', payload: [newOrder, ...orders] })
        //scheduleAutoCancelOrder(newOrder);
        return router.push(`/order/${res.newOrder._id}`)
      })
  }

  const scheduleAutoCancelOrder = (newOrder) => {
    try {
      const timer = setTimeout(() => {
        console.log('Product Auto Cancellation Process Check Start...');
        getData(`order/${newOrder._id}`, auth.token)
          .then(res => {
            if (res.err) return;
            const order = res.order;
            if (order && !order.placed || (order.method === undefined || order.method === ONLINE)) {
              //console.log('No payment done for order : ', order._id);
              deleteOrder(order);
            }
          })
        clearTimeout(timer);
      }, process.env.NEXT_PUBLIC_AUTO_CANCEL_ORDER_TIME);
    } catch (error) {
    }
  }

  const deleteOrder = (order) => {
    console.log('Deleting order...')
    deleteData(`order/${order._id}`, auth.token)
      .then(res => {
        if (res.err) return;
        updateInStockAndSoldOfProduct(order);
        dispatch(deleteItem(orders, order._id, 'ADD_ORDERS'));
      })
  }

  const updateInStockAndSoldOfProduct = (order) => {
    console.log('Updating Instock and Sold count...')
    order.cart.map(product => {
      putData(`product/${product._id}`, { updateStockAndSold: true, sold: product.sold - product.quantity, inStock: product.inStock + product.quantity }, auth.token)
        .then(res => {
          if (res.err) return;
          //console.log(res.msg)
        })
    })
  }

  const formatAddress = () => {
    var addressCheck = address.toLowerCase();
    var finaladdr = addressCheck;

    var addrCityCheck = addressCheck.includes("hyderabad");
    var addrStateCheck = addressCheck.includes("telangana");
    var addrCountryCheck = addressCheck.includes("india");
    if (addrCityCheck || addrStateCheck || addrCountryCheck) {
      if (!addrCountryCheck) {
        finaladdr += ", " + country.toLowerCase()
        if (!addrCityCheck) {
          var index = finaladdr.indexOf(countryState.toLowerCase());
          finaladdr = [finaladdr.slice(0, index), ", " + city + ", ", finaladdr.slice(index)].join('');
        }
      } else {
        if (!addrStateCheck) {
          var index = finaladdr.indexOf(country.toLowerCase());
          finaladdr = [finaladdr.slice(0, index), ", " + countryState + ", ", finaladdr.slice(index)].join('');
        }
        if (!addrCityCheck) {
          var index = finaladdr.indexOf(countryState.toLowerCase());
          finaladdr = [finaladdr.slice(0, index), ", " + city + ", ", finaladdr.slice(index)].join('');
        }
      }
    } else {
      finaladdr = finaladdr + ", " + city + ", " + countryState + ", " + country
    }
    finaladdr = finaladdr.replaceAll(', , ,', ',').replace(', ,', ', ');
    return finaladdr;
  }

  if (cart.length === 0) {
    return (
      <div className='text-alingn-center'>
        <div className="sorry_and_continue_msg">
          Sorry, your <i className="fas fa-shopping-cart position-relative" aria-hidden="true"></i>cart is empty. Please add an item to place an order : <a href='/' style={{ fontWeight: '800' }}>
            Continue Shopping <i className="fas fa-home" aria-hidden="true" ></i></a>.
        </div>
      </div>
    )
  }

  return (
    <div className="container-fluid row justify-content-md-between" onSubmit={handlePayment}>
      <Head>
        <title>KFM Cart - Cart Page</title>
      </Head>
      <h2 className="container text-uppercase mt-3" >Shopping Cart</h2>
      <div className="col-md-6 text-secondary table-responsive my-3 colHeight">

        <table className="table my-3">
          <tbody>
            {
              cart.map(item => (
                <CartItem key={item._id} item={item} dispatch={dispatch} cart={cart} isAdmin={auth && auth.user && auth.user.role === 'admin'} />
              ))
            }
          </tbody>
        </table>
      </div>

      <div className="shipping-card col-md-4 my-3 mx-md-3 text-left text-uppercase text-secondary border_login">
        <form>
          <h4>Shipping Details</h4>

          <label htmlFor="address">Address</label>
          <textarea type="text" name="address" id="address"
            maxLength="50"
            className="form-control mb-2" value={address}
            onChange={e => setAddress(e.target.value)} />

          <div className="row">
            <div className="col-xl-4">
              <label htmlFor="cities">City</label>
              <select className="form-control mb-2 custom-select text-capitalize" onChange={e => setCity(e.target.value)}>
                {
                  CITIES_ARR.map(city => (
                    <option value={city} key={city}>{city}</option>
                  ))}
              </select>
            </div>
            <div className="col-xl-4 pl-md-1">
              <label htmlFor="state">State</label>
              <select className="form-control mb-2 custom-select text-capitalize" onChange={e => setCountryState(e.target.value)}>
                {
                  STATES_ARR.map(countryState => (
                    <option value={countryState} key={countryState}>{countryState}</option>
                  ))
                }
              </select>
            </div>
            <div className="col-xl-4 pl-md-1">
              <label htmlFor="country">Country</label>
              <select className="form-control mb-2 custom-select text-capitalize" onChange={e => setCountry(e.target.value)}>
                {
                  COUNTRIES_ARR.map((country) => (
                    <option value={country} key={country}>{country}</option>
                  ))
                }
              </select>
            </div>
          </div>

          <label htmlFor="mobile">Mobile</label>
          <input type="text" name="mobile" id="mobile"
            className="form-control mb-2" value={mobile}
            maxLength="10"
            onChange={e => setMobile(e.target.value)} />
        </form>
        <h5 style={{ color: 'black' }}>Total: <span>₹{total}</span></h5>

        <Link href={auth.user ? '#!' : '/signin'}>
          <a className="btn btn-primary my-2 cartPayBtn" onClick={handlePayment}>Proceed to pay</a>
        </Link>

      </div>
    </div>
  )
}

export default Cart