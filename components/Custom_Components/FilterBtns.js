import { useEffect, useState } from "react";

const FilterBtns = ({ filterBtns, handleFilter }) => {
    const [filtersArr, setFiltersArr] = useState();
    useEffect(() => {
        setFiltersArr(filterBtns ? filterBtns : [])
    }, [filterBtns])

    return (
        <>
            {
                filtersArr &&
                filtersArr.map((item, i) => (
                    <span key={i}>
                        <button onClick={() => { handleFilter(item.type) }} className={`btn btn-${item.type === 'All' ? 'success' : item.type} btn-sm m-1`} data-toggle="tooltip" data-placement="bottom" title={item.description}>{item.name}<span className="badge badge-light">{item.count}</span></button>
                    </span>
                ))
            }
        </>
    )
}

export default FilterBtns;