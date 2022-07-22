import { createContext, useReducer, useEffect } from 'react'
import reducers from './Reducers'
import { getData } from '../utils/fetchData'
import Cookie from 'js-cookie';

export const DataContext = createContext()


export const DataProvider = ({ children }) => {
    const initialState = {
        notify: {}, auth: {}, cart: [], modal: [], orders: [], users: [], categories: []
    }

    const [state, dispatch] = useReducer(reducers, initialState)
    const { cart, auth } = state

    useEffect(() => {
        redirectToHttps();
        const firstLogin = Cookie.get("firstLogin");
        const refreshtoken = Cookie.get("refreshtoken");
        if (firstLogin || refreshtoken) {
            getData('auth/accessToken').then(res => {
                if (res.err) {
                    Cookie.remove('firstLogin', { path: 'api/auth/accessToken' });
                    Cookie.remove('refreshtoken', { path: 'api/auth/accessToken' });
                    return;
                }
                dispatch({
                    type: "AUTH",
                    payload: {
                        token: res.access_token,
                        user: res.user
                    }
                })
            })
        }

        getData('categories').then(res => {
            if (res.err) return dispatch({ type: 'NOTIFY', payload: { error: res.err } })

            dispatch({
                type: "ADD_CATEGORIES",
                payload: res.categories
            })
        })

    }, [])

    useEffect(() => {
        const __next__cart01 = JSON.parse(localStorage.getItem('__next__cart01'))
      
        if (__next__cart01) dispatch({ type: 'ADD_CART', payload: __next__cart01 })
    }, [])

    useEffect(() => {
        localStorage.setItem('__next__cart01', JSON.stringify(cart))
    }, [cart])

    useEffect(() => {
        if (auth.token) {
            if (auth.user.role === 'admin') {
                getData('user', auth.token)
                    .then(res => {
                        if (res.err) return dispatch({ type: 'NOTIFY', payload: { error: res.err } })
                        dispatch({ type: 'ADD_USERS', payload: res.users })
                })
            }
        } else {
            dispatch({ type: 'ADD_ORDERS', payload: [] })
            dispatch({ type: 'ADD_USERS', payload: [] })
        }
    }, [auth.token])

    const redirectToHttps = () => {
        if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_HOSTNAME !== 'localhost') {
            if (window.location.protocol == 'http:') {
                window.location.href = window.location.href.replace('http:', 'https:');
            }
        }
    }

    return (
        <DataContext.Provider value={{ state, dispatch }}>
            {children}
        </DataContext.Provider>
    )
}