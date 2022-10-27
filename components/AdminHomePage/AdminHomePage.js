import DeleteProducts from "./DeleteProducts"

const AdminHomePage = (props) => {
    return (
        <>
            <div className="container-fluid">
                {
                    props.isAdmin &&
                    <>
                        <div className="mt-4 mb-4">
                            <DeleteProducts products={props.products} handleCheckALL={props.handleCheckALL} dispatch={props.dispatch} isCheck={props.isCheck} />
                        </div>
                    </>
                }
            </div>
        </>
    )
}
export default AdminHomePage