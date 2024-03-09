import { isEmpty } from "lodash";
import { useEffect, useRef, useState } from "react";
import { populateProduct } from "../../utils/productManagerUtil";
import { parseNumDecimalType } from "../../utils/util";
import PriceQuantiity from "./PriceQuantity";

const CustomSize = ({ dataArr, handleSizes }) => {
    const TAX = process.env.NEXT_PUBLIC_RAZORPAY_TAX;
    const inititalSize = {
        type: 'custom',
        size: '',
        price: 0,
        mrpPrice: 0,
        totalPrice: 0,
        tax: 0,
        inStock: 0
    }

    const [sizes, setSizes] = useState([inititalSize]);
    let isDisplayProductChanged = useRef(false);

    useEffect(() => {
        if (!isEmpty(dataArr)) {
            setSizes(dataArr)
        }
    }, [dataArr])

    const handleAddSize = (e) => {
        e.preventDefault();
        setSizes([...sizes, inititalSize]);
    }

    const deleteSize = index => {
        const newArr = [...sizes]
        newArr.splice(index, 1);
        setSizes(newArr);
    }

    const handleChangeInput = (e, index) => {
        const { name, value, type } = e.target;
        let newArr = [...sizes];
        const parsedVal = parseNumDecimalType(value, type);
        newArr[index] = populateProduct(name, parsedVal, TAX, { ...newArr[index] });
        setSizes(newArr);
    }

    const handleDisplayProduct = e => {
        const index = e.target.value;
        sizes.forEach(size => delete size.isDisplay);
        const newArr = [...sizes]
        newArr[index] = { ...newArr[index], isDisplay: true };
        setSizes(newArr);
        isDisplayProductChanged.current = true;
    }

    return (
        <>
            {sizes && sizes.map((size, index) => (
                <div key={index} className="row mt-2 p-1 border">
                    <div className="col-4 col-lg-4">
                        <label className='product-attributes-label' htmlFor="size">Size</label>
                        <input type="text" name="size" value={size.size}
                            placeholder="Size" className={'d-block w-100 product-attributes-input'}
                            onChange={(e) => { handleChangeInput(e, index) }}
                            maxLength='10'
                        />
                    </div>
                    <div className="col-6 col-lg-8">
                        <div className="float-right size-del-btn" onClick={() => { deleteSize(index) }}>x</div>
                    </div>
                    <PriceQuantiity product={size} handleChangeInput={(e) => { handleChangeInput(e, index) }} />
                    <div className="col-6 col-lg-6 pt-2 display-product">
                        <input type="radio" name="display-product" value={index} defaultChecked={size.isDisplay} onClick={handleDisplayProduct} />
                        <label className="pl-1 my-0" htmlFor="display-product">Display Product</label>
                    </div>
                </div>
            ))}
            <button className="mt-2 btn-primary" onClick={handleAddSize}>+ More Size</button>
            <button hidden id='link-sizes' className="mt-2 btn-primary" onClick={() => { handleSizes(sizes, isDisplayProductChanged.current) }}>Link Sizes</button>
        </>
    );
}

export default CustomSize;