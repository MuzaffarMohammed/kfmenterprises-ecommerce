const PriceQuantiity = (props) => {
    return (
        <div className="row justify-content-between">
            <div className="col-3 col-lg-2">
                <label className='product-attributes-label' htmlFor="mrpPrice">MRP Price</label>
                <input type="number" name="mrpPrice" value={props.product.mrpPrice}
                    placeholder="Price" className={'d-block w-100 product-attributes-input'}
                    onChange={props.handleChangeInput}
                    maxLength='5'
                    min="0"
                    step="0.01"
                />
            </div>
            <div className="col-3 col-lg-2 pl-1">
                <label className='product-attributes-label' htmlFor="price">Your Price</label>
                <input type="number" name="price" value={props.product.price}
                    placeholder="Price" className={'d-block w-100 product-attributes-input'}
                    onChange={props.handleChangeInput}
                    maxLength='5'
                    min="0"
                    step="0.01"
                />
            </div>
            <div className="col-3 col-lg-2 pl-1">
                <label className='product-attributes-label' htmlFor="tax">Tax (2%)</label>
                <input type="number" name="tax" value={props.product.tax}
                    placeholder="Tax" className={'d-block w-100 product-attributes-input'}
                    disabled
                    onChange={props.handleChangeInput}
                    min="0"
                />
            </div>
            <div className="col-3 col-lg-2 pl-1">
                <label className='product-attributes-label' htmlFor="total">Total Price</label>
                <input type="number" name="total" value={props.product.totalPrice}
                    placeholder="Total Price" className={'d-block w-100 product-attributes-input'}
                    onChange={props.handleChangeInput}
                    disabled
                    min="0"
                />
            </div>
            <div className="col-3 col-lg-2 pl-1">
                <label className='product-attributes-label' htmlFor="inStock">In Stock</label>
                <input type="number" name="inStock" value={props.product.inStock}
                    placeholder="inStock" className={'d-block w-100 product-attributes-input'}
                    onChange={props.handleChangeInput}
                    maxLength='5'
                    min="0"
                />
            </div>
        </div>
    );
}

export default PriceQuantiity;