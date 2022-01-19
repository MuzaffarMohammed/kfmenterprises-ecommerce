import { useContext } from 'react'
import { DataContext } from '../store/GlobalState'
import Loading from './Loading'
import Toast from './Toast'

const Notify = () => {
    const { state, dispatch } = useContext(DataContext)
    const { notify } = state

    if (notify.error || notify.success) {
        setTimeout(() => {
            dispatch({ type: 'NOTIFY', payload: {} })
        }, notify.delay ? notify.delay : 6000);
    }

    return (
        <>
            {notify.loading && <Loading msg={notify.msg} isPay={notify.isPay}/>}
            {notify.error &&
                <Toast
                    msg={{ msg: notify.error, title: "Error" }}
                    handleShow={() => dispatch({ type: 'NOTIFY', payload: {} })}
                    bgColor="bg-danger"
                />
            }

            {notify.success &&
                <Toast
                    msg={{ msg: notify.success, title: "Success" }}
                    handleShow={() => dispatch({ type: 'NOTIFY', payload: {} })}
                    bgColor="bg-success"
                />
            }
        </>
    )
}


export default Notify
