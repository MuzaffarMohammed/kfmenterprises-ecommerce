import { useEffect, useRef, useState } from 'react'
import { DateRange, DefinedRange } from 'react-date-range'
import format from 'date-fns/format'
import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'
import { DATE_FORMAT } from '../../utils/constants'
import USLocale from 'date-fns/locale/en-US';
import indiaLocale from 'date-fns/locale/en-IN';

const DateRangeSelector = (props) => {

    // date state
    const [range, setRange] = useState(props.defaultRange)
    const [dateFormat, setDateFormat] = useState(props.dateFormat ? props.dateFormat : DATE_FORMAT)
    // open close
    const [open, setOpen] = useState(false)
    const [openGroup, setOpenGroup] = useState(false)

    // get the target element to toggle 
    const refOne = useRef(null)
    const counter = useRef(1)

    useEffect(() => {
        // event listeners
        document.addEventListener("keydown", hideOnEscape, true)
        document.addEventListener("click", hideOnClickOutside, true)
    }, [])

    // hide dropdown on ESC press
    const hideOnEscape = (e) => {
        // console.log(e.key)
        if (e.key === "Escape") {
            setOpen(false)
            setOpenGroup(false)
        }
    }

    // Hide dropdown on outside click
    const hideOnClickOutside = (e) => {
        if (refOne.current && !refOne.current.contains(e.target)) {
            setOpen(false)
        }
    }

    const handleDefineRangeSelect = () => {
        props.handleSelect(range);
        setOpenGroup(false);
    }

    const handleDateRangeSelect = () => {
        props.handleSelect(range);
        setOpen(false);
    }

    return (
        <>
            <div className="dateRange-comp">
                <input style={{ width: '235px', fontSize: '15px', display: 'inline', background: 'white' }}
                    value={`${format(range[0].startDate, dateFormat)} to ${format(range[0].endDate, dateFormat)}`}
                    readOnly
                    className="form-control"
                    title="Please select the Date Range"
                    onClick={() => { setOpen(open => !open); setOpenGroup(false); }}
                />
                <button className='btn btn-primary ml-2' onClick={() => setOpenGroup(openGroup => !openGroup)} title="Filter By" ><i className="fas fa-filter"></i></button>
            </div>
            <div className='dateRange-card-align'>
                {openGroup &&
                    <div className='dateRange-card'>
                        <DefinedRange
                            onChange={item => setRange([item.selection])}
                            ranges={range}
                            locale={indiaLocale}
                        />
                        <button className='btn btn-primary ml-2 mr-2' onClick={handleDefineRangeSelect}><i className="fas fa-filter"></i> Filter</button>
                    </div>
                }
            </div>
            <div className='dateRange-card-align' ref={refOne}>
                {open &&
                    <div className='dateRange-card'>
                        <DateRange
                            onChange={item => setRange([item.selection])}
                            editableDateInputs={true}
                            moveRangeOnFirstSelection={false}
                            ranges={range}
                            locale={indiaLocale}
                            months={typeof window !== 'undefined' && window.innerWidth <= 900 ? 1 : 2}
                            direction={typeof window !== 'undefined' && window.innerWidth <= 900 ? "vertical" : "horizontal"}
                            className="calendarElement"
                        />
                        <button className='btn btn-primary ml-2 mr-2' onClick={handleDateRangeSelect}><i className="fas fa-filter"></i> Filter</button>
                    </div>
                }

            </div>
        </>
    )
}

export default DateRangeSelector