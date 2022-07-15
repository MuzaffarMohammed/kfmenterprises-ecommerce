import { useContext } from 'react'
import { DataContext } from '../store/GlobalState'
import { deleteItem } from '../store/Actions'
import { deleteData } from '../utils/fetchData'
import { useRouter } from 'next/router'
import { ADDRESS_EDIT, SIGN_IN } from '../utils/constants'


const Modal = () => {
    const { state, dispatch } = useContext(DataContext)
    const { modal, auth } = state

    const router = useRouter()

    const deleteUser = (item) => {
        dispatch(deleteItem(item.data, item.id, item.type))

        deleteData(`user/${item.id}`, auth.token)
            .then(res => {
                if (res.err) return dispatch({ type: 'NOTIFY', payload: { error: res.err } })
                return dispatch({ type: 'NOTIFY', payload: { success: res.msg } })
            })
    }

    const deleteCategories = (item) => {
        deleteData(`categories/${item.id}`, auth.token)
            .then(res => {
                if (res.err) return dispatch({ type: 'NOTIFY', payload: { error: res.err } })

                dispatch(deleteItem(item.data, item.id, item.type))
                return dispatch({ type: 'NOTIFY', payload: { success: res.msg } })
            })
    }

    const deleteProduct = (delArr) => {
        delArr.forEach(item => {
            dispatch({ type: 'NOTIFY', payload: { loading: true } })
            deleteData(`product/${item.id}`, auth.token)
                .then(res => {
                    if (res.err) return dispatch({ type: 'NOTIFY', payload: { error: res.err } })
                    dispatch({ type: 'NOTIFY', payload: { success: res.msg } })
                    return router.push('/')
                })
        });
    }

    const handleSubmit = () => {

        if (!modal.type) return;

        if (modal.type === 'ADD_CART') dispatch(deleteItem(modal.data, modal.id, modal.type))

        if (modal.type === 'ADD_USERS') deleteUser(modal)

        if (modal.type === 'ADD_CATEGORIES') deleteCategories(modal)

        if (modal.type === 'DELETE_PRODUCT') deleteProduct(modal.data)

        dispatch({ type: 'ADD_MODAL', payload: {} })

    }

    return (
        <div className="modal fade" id="confirmModal" tabIndex="-1" role="dialog" aria-labelledby="confirmModalLabel" aria-hidden="true">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title text-capitalize" id="confirmModalLabel">
                            {modal.title}
                        </h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        {modal.content}
                    </div>
                    {
                        (modal.type !== SIGN_IN || modal.type !== ADDRESS_EDIT) && (
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={handleSubmit}>Yes</button>
                                <button type="button" className="btn btn-primary" data-dismiss="modal">Cancel</button>
                            </div>
                        )}
                </div>
            </div>
        </div>
    )
}

export default Modal