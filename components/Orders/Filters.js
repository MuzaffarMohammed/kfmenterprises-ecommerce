import { ACCEPTED, ALL, DELIVERED, IN_TRANSIT, REJECTED, TODAY, YET_TO_DISPATCH } from "../../utils/constants";

export default function Filters(props) {
    return (
        <div className="float-right">
            <button onClick={() => { props.handleFilter(ALL) }} className="btn btn-dark btn-sm m-1 " data-toggle="tooltip" data-placement="bottom" title="All Orders">All Orders <span className="badge badge-light">{props.lengths || props.lengths === 0 ? props.lengths['ALL'] : ''}</span></button>
            <button onClick={() => { props.handleFilter(TODAY) }} className="btn btn-primary btn-sm m-1 " data-toggle="tooltip" data-placement="bottom" title="Today's Orders">Today <span className="badge badge-light">{props.lengths || props.lengths === 0 ? props.lengths['TODAY'] : ''}</span></button>
            {props.isAdmin && (
                <>
                    <button onClick={() => { props.handleFilter(YET_TO_DISPATCH) }} className="btn btn-warning btn-sm m-1 " data-toggle="tooltip" data-placement="bottom" title="Awaiting Confirmation Orders">New Orders <span className="badge badge-light">{props.lengths || props.lengths === 0 ? props.lengths['YET_TO_DISPATCH'] : ''}</span></button>
                    <button onClick={() => { props.handleFilter(ACCEPTED) }} className="btn btn-primary btn-sm m-1 " data-toggle="tooltip" data-placement="bottom" title="Accepted Orders">Accepted <span className="badge badge-light">{props.lengths || props.lengths === 0 ? props.lengths['ACCEPTED'] : ''}</span></button>
                </>
            )}
            {props.isUser && (
                <>
                    <button onClick={() => { props.handleFilter(YET_TO_DISPATCH) }} className="btn btn-secondary btn-sm m-1 " data-toggle="tooltip" data-placement="bottom" title="Awaiting Confirmation Orders">Not Dispatched <span className="badge badge-light">{props.lengths || props.lengths === 0 ? props.lengths['YET_TO_DISPATCH'] : ''}</span></button>
                    <button onClick={() => { props.handleFilter(IN_TRANSIT) }} className="btn btn-warning btn-sm m-1 " data-toggle="tooltip" data-placement="bottom" title="In Transit Orders">In Transit <span className="badge badge-light">{props.lengths || props.lengths === 0 ? props.lengths['IN_TRANSIT'] : ''}</span></button>

                </>
            )}
            <button onClick={() => { props.handleFilter(DELIVERED) }} className="btn btn-success btn-sm m-1 " data-toggle="tooltip" data-placement="bottom" title="All Delivered Orders">Delivered <span className="badge badge-light">{props.lengths || props.lengths === 0 ? props.lengths['DELIVERED'] : ''}</span></button>
            <button onClick={() => { props.handleFilter(REJECTED) }} className="btn btn-danger btn-sm m-1 " data-toggle="tooltip" data-placement="bottom" title="Rejected By Seller">Rejected <span className="badge badge-light">{props.lengths || props.lengths === 0 ? props.lengths['REJECTED'] : ''}</span></button>

        </div>
    );
}