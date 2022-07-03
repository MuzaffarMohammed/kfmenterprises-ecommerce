import connectDB from '../../../utils/connectDB'
import Kpis from '../../../models/kpiModel'
import Orders from '../../../models/orderModel'
import Products from '../../../models/productModel'
import auth from '../../../middleware/auth'
import { CONTACT_ADMIN_ERR_MSG, ERROR_401 } from '../../../utils/constants'

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
    }
}

const getParameterValue = (name, orders, products) => {
    switch (name) {
        case "Total Products":
            return products && products.length;
            break;
        case "Total Orders":
            return orders && orders.length;
            break;
        default:
            return undefined;
    }
}

const getKpis = async (req, res) => {
    try {
        const result = await auth(req, res)
        if (result.role !== 'admin') return res.status(401).json({ err: ERROR_401 })

        const KpisArr = await Kpis.find();
        const orders = await Orders.find();
        const products = await Products.find();

        let kpiData = {
            cards: [],
            charts: []
        };

        if (KpisArr) {
            KpisArr.forEach(kpi => {
                if (kpi.type === 'card') {
                    const data = getParameterValue(kpi.name, orders, products);
                    if (data) {
                        console.log("data : ", data)
                        const card = { id: kpi.id, name: kpi.name, data: data }
                        kpiData.cards.push(card);
                    }
                }
            });
        }



        kpiData = {
            cards: [
                { id: 'pir1', name: 'Profit in Rupees', data: '155cr' },
                { id: 'pir2', name: 'Total Orders', data: 45 },
                { id: 'pir3', name: 'Profit in Rupees', data: '455cr' },
                { id: 'pir4', name: 'Profit in Rupees Rupees Rupees', data: '155cr' },
                { id: 'pir5', name: 'Total Orders', data: 45 },
                { id: 'pir6', name: 'Profit in Rupees', data: '455cr' }
            ],
            charts: [
                {
                    id: 'su',
                    name: 'Stock Utilization', data: {
                        type: "gauge",
                        columns: [
                            ['Used Stock', 68]
                        ]
                    }
                },
                {
                    id: 'mws',
                    name: 'Monthly Sell Vs Demand',
                    data: {
                        type: "bar",
                        columns: [
                            ['Iventory Available Stock', 10, 60, 70, 50],
                            ['Demand', 5, 40, 80, 40]
                        ]
                    }
                },
                {
                    id: 'ds',
                    name: 'Demand Spike', data: {
                        type: "line",
                        columns: [
                            ['Stock', 10, 60, 70, 50],
                            ['Demand', 5, 40, 80, 40]
                        ]
                    }
                }
                ,
                {
                    id: 'ds2',
                    name: 'Demand Spike', data: {
                        type: "line",
                        columns: [
                            ['Stock', 10, 60, 70, 50],
                            ['Demand', 5, 40, 80, 40]
                        ]
                    }
                }
                ,
                {
                    id: 'ds3',
                    name: 'Demand Spike', data: {
                        type: "line",
                        columns: [
                            ['Stock', 10, 60, 70, 50],
                            ['Demand', 5, 40, 80, 40]
                        ]
                    }
                }
            ]
        }

        res.json({ kpiData });
    } catch (err) {
        console.error('Error occurred while getKpis: ' + err);
        return res.status(500).json({ err: CONTACT_ADMIN_ERR_MSG })
    }
}