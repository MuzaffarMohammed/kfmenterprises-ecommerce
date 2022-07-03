import DeleteProducts from "./DeleteProducts"
import dynamic from "next/dynamic"


const AdminHomePage = (props) => {

    const DashboardKPIs = dynamic(() => import("./DashboardKPIs"), { ssr: false })

    return (
        <>
            <div className="container-fluid">
                {
                    props.isAdmin &&
                    <>
                        <div className="mt-3 mb-3 shadow-card">
                            <h1>Dashboard</h1>
                            <DashboardKPIs kpiData={props.kpis}/>
                        </div>
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