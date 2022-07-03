

const DeleteProducts = (props) => {

    const handleDeleteAll = () => {
        let deleteArr = [];
        props.products.forEach(product => {
            if (product.checked) {
                deleteArr.push({
                    data: '',
                    id: product._id,
                    title: 'Delete all selected products?',
                    type: 'DELETE_PRODUCT'
                })
            }
        })
        props.dispatch({ type: 'ADD_MODAL', payload: { data: deleteArr, type: 'DELETE_PRODUCT', content: 'Do you want to delete this item?' } })
    }

    return (
        <>
            <div className="delete_all btn btn-danger mt-2 mx-2" style={{ marginBottom: '-10px' }}>
                <input type="checkbox" checked={props.isCheck} onChange={props.handleCheckALL}
                    style={{ width: '25px', height: '25px', transform: 'translateY(8px)' }} />
                <button className="btn btn-danger ml-2"
                    data-toggle="modal" data-target="#confirmModal"
                    onClick={handleDeleteAll}>
                    Delete All Products
                </button>
            </div>

        </>
    )
}
export default DeleteProducts