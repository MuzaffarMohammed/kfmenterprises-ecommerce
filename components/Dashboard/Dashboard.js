import { useContext, useEffect, useState } from 'react'
import { DataContext } from '../../store/GlobalState'
import { isLoading } from '../../utils/util';
import { getData } from '../../utils/fetchData';
import dynamic from "next/dynamic"

export default function Dashboard() {
    const { state, dispatch } = useContext(DataContext);
    const { auth } = state;
    const isAdmin = auth && auth.user && auth.user.role === 'admin';
    const [kpiData, setkpiData] = useState({})
    const DashboardKPIs = dynamic(() => import("./DashboardKPIs"), { ssr: false })

    useEffect(() => {
        if (auth && auth.token) {
            isLoading(true, dispatch)
            getData('kpi', auth.token)
                .then(res => {
                    isLoading(false, dispatch)
                    if (res.err) setkpiData([]);
                    else setkpiData(res.kpiData);
                })
        }
    }, [auth])

    if (!isAdmin) return null;
    return (
        <>
            <h2 className="container text-uppercase mt-3" >Dashboard</h2>
            <DashboardKPIs kpiData={kpiData} auth={auth} dispatch={dispatch} />
        </>
    );
}