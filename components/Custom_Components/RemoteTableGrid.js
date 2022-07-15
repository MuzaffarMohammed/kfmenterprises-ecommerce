import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import Loading from '../Loading';
import PropTypes from 'prop-types';
import { useState } from 'react';

export const RemoteTableGrid = ({ keyField, columns, data, page, sizePerPage, totalSize, sort, handleTableChange }) => {
    const [classes, setClasses] = useState(typeof window !== 'undefined' && window.innerWidth <= 900 ? ['table-responsive'] : '')
    return (
        <BootstrapTable
            remote
            classes={classes}
            keyField={keyField}
            data={data}
            columns={columns}
            pagination={paginationFactory({ page, sizePerPage, totalSize })}
            onTableChange={handleTableChange}
            striped
            condensed
            hover
            noDataIndication={() => <Loading />}
        />
    );
}

RemoteTableGrid.propTypes = {
    data: PropTypes.array.isRequired,
    columns: PropTypes.array.isRequired,
    page: PropTypes.number.isRequired,
    totalSize: PropTypes.number.isRequired,
    sizePerPage: PropTypes.number.isRequired,
    handleTableChange: PropTypes.func.isRequired
};

export default RemoteTableGrid;
