import React from 'react'

const Filter = ({ isAdmin, categories, selectedCategory, searchText, selectedSort, handleCategory, handleSearch, handleSort }) => {
    const ALL = 'all';

    return (
        <div className="row justify-content-sm-center">
            <div className="row align-items-center col-md-5">
                <div className='mr-2'>
                    <i className="fas fa-search" aria-hidden="true" />
                </div>
                <form className="product-search" autoComplete="off" >
                    <input type="text" className="form-control" list="title_product" placeholder="Search your item here..."
                        value={searchText.toLowerCase()}
                        onChange={(e) => { handleSearch(e.target.value) }}
                        maxLength='25' />
                </form>
            </div>
            <div className="row pt-1 pt-md-0 align-items-center">
                <div className='row align-items-center'>
                    <div className='pr-2'>
                        <i className="fas fa-filter" aria-hidden="true" />
                    </div>
                    <div>
                        <select name="Filter" className="custom-select" value={selectedCategory} onChange={(e) => {
                            handleCategory(e.target.value);
                        }}>
                            {isAdmin && <option value={ALL}> All</option>}
                            {
                                categories.map(item => (
                                    <option key={item._id} value={item._id}>{item.name}</option>
                                ))
                            }
                        </select>
                    </div>
                </div>
                <div className='row pt-1 pt-md-0 align-items-center'>
                    <div className='pl-2 pr-2'>
                        <i className="fas fa-sort-amount-up-alt" aria-hidden="true" />
                    </div>
                    <div>
                        <select name="Sort" className="custom-select" value={selectedSort} onChange={(e) => { handleSort(e.target.value) }}>
                            <option value="-createdAt">Newest Arrivals</option>
                            <option value="-sold">Best sales</option>
                            <option value="-totalPrice">Price: High-Low</option>
                            <option value="totalPrice">Price: Low-High</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Filter
