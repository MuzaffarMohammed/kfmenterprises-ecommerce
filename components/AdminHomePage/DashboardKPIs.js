
import c3 from "c3";
import 'c3/c3.css';
import { useEffect, useRef } from "react";

const DashboardKPIs = ({ kpiData }) => {
    let counter = useRef(1);
    useEffect(() => {
        if (kpiData && kpiData.charts && kpiData.charts.length > 0 && counter.current < 2) {
            counter.current = 2;
            kpiData.charts.forEach(kpi => {
                c3.generate({
                    bindto: `#${kpi.id}`,
                    data: kpi.data
                });
            });
        }
    }, [kpiData])

    return (
        <>
            <div className="row">
                {
                    counter.current < 2 && kpiData && kpiData.cards && kpiData.cards.map(kpi => (
                        <div key={kpi.id} className="column dashboard-cards">
                            <h6 className="mb-0 font-weight-bold app-color">{kpi.data}</h6>
                            <span style={{ fontSize: "12px", fontWeight: "600" }}>{kpi.name}</span>
                        </div>
                    ))
                }
            </div>
            <div className="mt-4 row">
                {counter.current < 2 && kpiData && kpiData.charts && kpiData.charts.map(kpi => (
                    <div key={kpi.id} className="column dashboard-charts">
                        <span style={{ fontSize: "12px", fontWeight: "600" }}>{kpi.name}</span>
                        <div style={{ height: "180px", margin: "1em auto" }} id={kpi.id}></div>
                    </div>
                ))
                }
            </div>
        </>
    );
}

export default DashboardKPIs