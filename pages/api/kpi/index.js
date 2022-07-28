import connectDB from '../../../utils/connectDB'
import Kpis from '../../../models/kpiModel'
import Orders from '../../../models/orderModel'
import Products from '../../../models/productModel'
import Users from '../../../models/userModel'
import Notifications from '../../../models/notificationsModel'
import auth from '../../../middleware/auth'
import { CONTACT_ADMIN_ERR_MSG, DANGER, ERROR_403, WARNING } from '../../../utils/constants'
import { getParameterValue, getTimeSeriesSalesData } from './util'
import isEmpty from 'lodash/isEmpty';
import { notAdminRole } from '../../../utils/util'

connectDB()

/*
    POST     - protected
    GET      - Public
*/

export default async (req, res) => {
    switch (req.method) {
        case "GET":
            await getKpis(req, res)
            break;
        case "POST":
            await getSingleKpi(req, res)
            break;
    }
}

const getSingleKpi = async (req, res) => {
    try {
        const result = await auth(req, res)
        if (result.role !== 'admin') return res.status(403).json({ err: ERROR_403 })
        const { dateRange, kpi } = req.body;
        const orders = await Orders.find({ delivered: true, createdAt: { $gte: dateRange[0].startDate, $lt: dateRange[0].endDate } }, { total: 1, delivered: 1, createdAt: 1 });        
        const kpiData = getTimeSeriesSalesData(orders, dateRange, kpi);
        res.json({ kpiData });
    } catch (err) {
        console.error('Error occurred while getSingleKpi: ' + err);
        return res.status(500).json({ err: CONTACT_ADMIN_ERR_MSG })
    }
}

const getKpis = async (req, res) => {
    try {
        const { role } = await auth(req, res)
        if (notAdminRole(role)) return res.status(401).json({ err: ERROR_403 })

        const kpisArr = await Kpis.find();
        const users = await Users.find({ activated: true }, { name: 1 });
        const orders = await Orders.find({}, { total: 1, delivered: 1, updatedAt: 1 });//all orders with only total, delivered, updatedAt field data.
        const products = await Products.find({}, { sold: 1, title: 1 }).sort({ sold: -1 });// All products order by sold = desc
        const notifications = await Notifications.find({ role: role, type: [DANGER, WARNING] })
        
        let kpiData = { cards: [], charts: [] };
        if (kpisArr) {
            kpisArr.forEach(kpi => {
                if (kpi.type === 'card') {
                    const data = getParameterValue(kpi.id, orders, products, users, notifications);
                    
                    if (kpiData.cards.length <= 6) {
                        kpiData.cards.push({ id: kpi.id, name: kpi.name, data: data ? data : 0 });// Maximum of six cards should be shown for better UI.
                    }
                } else {
                    let columns = [];
                    if (!kpi.singleAnalysis) {
                        kpi.columns.forEach(column => {
                            const data = getParameterValue(column, orders, products, users, notifications);
                            if (data) {
                                let colData = [column, ...data];
                                columns.push(colData);
                            } else columns = [];
                        });
                    } else columns = kpi.columns;
                    if (!isEmpty(columns)) {
                        kpiData.charts.push({ id: kpi.id, singleAnalysis: kpi.singleAnalysis, name: kpi.name, data: { type: kpi.type, columns: columns } });
                    }
                }
            });
        }



        // kpiData = {
        //     cards: [
        //         { id: 'pir1', name: 'Profit in Rupees', data: '155cr' },
        //         { id: 'pir2', name: 'Total Orders', data: 45 },
        //         { id: 'pir3', name: 'Profit in Rupees', data: '455cr' },
        //         { id: 'pir4', name: 'Profit in Rupees Rupees Rupees', data: '155cr' },
        //         { id: 'pir5', name: 'Total Orders', data: 45 },
        //         { id: 'pir6', name: 'Profit in Rupees', data: '455cr' }
        //     ],
        //     charts: [
        //         {
        //             id: 'su',
        //             name: 'Stock Utilization', data: {
        //                 type: "gauge",
        //                 columns: [
        //                     ['Used Stock', 68]
        //                 ]
        //             }
        //         },
        //         {
        //             id: 'mws',
        //             name: 'Monthly Sell Vs Demand',
        //             data: {
        //                 type: "bar",
        //                 columns: [
        //                     ['Iventory Available Stock', 10, 60, 70, 50],
        //                     ['Demand', 5, 40, 80, 40]
        //                 ]
        //             }
        //         },
        //         {
        //             id: 'ds',
        //             name: 'Demand Spike', data: {
        //                 type: "line",
        //                 columns: [
        //                     ['Stock', 10, 60, 70, 50],
        //                     ['Demand', 5, 40, 80, 40]
        //                 ]
        //             }
        //         }
        //         ,
        //         {
        //             id: 'ds2',
        //             name: 'Demand Spike', data: {
        //                 type: "line",
        //                 columns: [
        //                     ['Stock', 10, 60, 70, 50],
        //                     ['Demand', 5, 40, 80, 40]
        //                 ]
        //             }
        //         }
        //     ]
        // }
        res.json({ kpiData });
    } catch (err) {
        console.error('Error occurred while getKpis: ' + err);
        return res.status(500).json({ err: CONTACT_ADMIN_ERR_MSG })
    }
}