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
            <h5 className="text-uppercase ml-3 mt-3" >Dashboard</h5>
            <DashboardKPIs kpiData={kpiData} auth={auth} dispatch={dispatch} />
        </>
    );
}