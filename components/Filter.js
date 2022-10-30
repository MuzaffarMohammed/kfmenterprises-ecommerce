import React from 'react'

const Filter = ({ isAdmin, categories, selectedCategory, searchText, selectedSort, handleCategory, handleSearch, handleSort }) => {
    const ALL = 'all';

    return (
        <div className="input-group">
            <div className="input-group-prepend col-md-2 px-2 mt-2">
                <select className="custom-select text-capitalize" value={selectedCategory} onChange={(e) => {
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
            <form autoComplete="off" className="mt-2 col-md-8 px-2">
                <input type="text" className="form-control" list="title_product" placeholder="Search your item here..."
                    value={searchText.toLowerCase()}
                    onChange={(e) => { handleSearch(e.target.value) }}
                    maxLength='25' />
            </form>
            <div className="input-group-prepend col-md-2 px-2 mt-2">
                <select className="custom-select" value={selectedSort} onChange={(e) => { handleSort(e.target.value) }}>
                    <option value="-createdAt">Newest Arrivals</option>
                    <option value="-sold">Best sales</option>
                    <option value="-totalPrice">Price: High-Low</option>
                    <option value="totalPrice">Price: Low-High</option>
                </select>
            </div>
        </div>
    )
}

export default Filter
