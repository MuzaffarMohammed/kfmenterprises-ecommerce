import Link from "next/link";
import PropTypes from 'prop-types';
import { classNameOnHover } from "../Orders/OrderFiltersUtil";
import { getCurrencyFormattedValue } from "../../utils/util";
import { orderDeliveryStatusFormatter, orderStatusFormatter, orderTimeDateFormatter } from "../Orders/OrderGridJson";
import Pagination from "./Pagination/Pagination";
import { useEffect, useState } from "react";

const TableGrid = ({ columns, rows, totalCount, isOrderPage, isAdmin, isDbPaginate, pageChange }) => {

    const [currentPage, setCurrentPage] = useState(1)
    const pageLimit = 15
    const [paginatedRows, setPaginatedRows] = useState(rows)

    useEffect(() => {
        if (rows) {
            setPaginatedRows(isDbPaginate ? rows : filterRows(currentPage, rows));
        }
    }, [rows])


    const linkFormatter = (column, row) => {
        const queryparams =
            column && column.format
            && column.format.url
            && column.format.url.queryParams;

        let params = '';
        if (queryparams) {
            Object.keys(queryparams).forEach(param => {
                if (row[queryparams[param]]) {
                    params += `&${param}=${row[queryparams[param]]}`
                }
            })
        }
        const href = `${column.format.url.uri ? column.format.url.uri : '#'}${params == '' ? '' : params}`

        return (
            column.field && row[column.field] ?
                (
                    <Link href={href} style={{ cursor: 'pointer' }}>
                        <a>{row[column.field]}</a>
                    </Link>
                )
                :
                ''
        );
    }

    const currencyFormatter = (column, row) => {
        return row[column.field] && getCurrencyFormattedValue(row[column.field]);
    }

    const cellFormatter = (column, row) => {
        if (!column.format) return row[column.field];
        switch (column.format.type) {
            case "link":
                return linkFormatter(column, row);
            case "orderTimeDate":
                return orderTimeDateFormatter(row);
            case "currency":
                return currencyFormatter(column, row);
            case "orderStatus":
                return orderStatusFormatter(row, isAdmin);
            case "orderDeliveryStatus":
                return orderDeliveryStatusFormatter(row);
            case "object":
                return row[column.format.field] && row[column.format.field][column.field]
            default:
                return row;
        }
    }
    const filterRows = (pageNo, rows) => {
        const start = pageNo < 2 ? 0 : ((pageNo - 1) * pageLimit);
        const end = pageNo < 2 ? pageLimit : start + pageLimit;
        return rows.slice(start, end);
    }
    const onPageChange = pageNo => {
        setCurrentPage(pageNo);
        if (isDbPaginate) return pageChange(pageNo);
        setPaginatedRows(filterRows(pageNo, rows));
    }

    return (
        <>
            <table className="table-bordered table-hover w-100 table-grid" style={{ minWidth: '600px' }}>
                <thead className="font-weight-bold app-bg-color">
                    <tr>
                        {
                            columns && columns.map(column => (
                                <th key={column.id} className='p-2'>{column.name}</th>
                            ))
                        }
                    </tr>
                </thead>
                <tbody>
                    {
                        paginatedRows && paginatedRows.map(row => (
                            <tr key={row._id} className={!isOrderPage ? '' : classNameOnHover(row)}>
                                {
                                    columns && columns.map(column => (
                                        <td key={column.id + '#' + row._id} className='p-1'>
                                            {cellFormatter(column, row)}
                                        </td>
                                    ))
                                }
                            </tr>
                        ))
                    }
                </tbody>
            </table>
            {
                !rows ?
                    <div className="no-data-card">
                        <label className='italic-text'>Whoops! No orders to display.</label>
                    </div>
                    :
                    <div className="mt-2 float-left">
                        <Pagination
                            className="pagination-bar"
                            currentPage={currentPage}
                            totalCount={totalCount}
                            pageSize={pageLimit}
                            onPageChange={page => onPageChange(page)}
                        />
                    </div>
            }
        </>
    );
}

TableGrid.propTypes = {
    isAdmin: PropTypes.bool.isRequired,
    columns: PropTypes.array.isRequired,
    rows: PropTypes.array.isRequired,
    totalCount: PropTypes.number,
    isOrderPage: PropTypes.bool,
}

export default TableGrid;