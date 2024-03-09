const ClothSizes = ({ sizesType, dataArr }) => {
    const getDataItem = (size, dataArr) => {
        let data = dataArr.filter(item => item.size === size);
        return data ? data[0] : {};
    }

    return (
        <>
            {sizesType.value.map(size => (
                <div className="row justify-content-between">
                    <div className="col-3 col-lg-2">
                        <label className='product-attributes-label' htmlFor="title">Size</label>
                        <input type="text" name="size" value={size} disabled
                            placeholder="Size" className={'d-block w-100 product-attributes-input'}
                            maxLength='25'
                        />
                    </div>
                    <div className="col-3 col-lg-3">
                        <label className='product-attributes-label' htmlFor="price">Price</label>
                        <input type="number" name="price" value={''}
                            placeholder="Price" className={'d-block w-100 product-attributes-input'}
                            maxLength='5'
                        />
                    </div>
                    <div className="col-3 col-lg-3">
                        <label className='product-attributes-label' htmlFor="stock">Quantity</label>
                        <input type="number" name="stock" value={''}
                            placeholder="Quantity" className={'d-block w-100 product-attributes-input'}
                            maxLength='5'
                        />
                    </div>
                </div>
            ))}
        </>
    );
}

export default ClothSizes;