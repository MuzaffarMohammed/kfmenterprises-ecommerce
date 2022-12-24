import { isEmpty } from "lodash"
import { useContext, useEffect, useRef, useState } from "react"
import { DataContext } from "../../store/GlobalState"
import { SIGNING_MSG } from "../../utils/constants"
import { putData } from "../../utils/fetchData"
import { deleteImagesFromCloudinary, populateProduct, updateAttributes, uploadImagesToCloudinary, validateUploadInputs } from "../../utils/productManagerUtil"
import { calculateDiscountedPercentage, handleResponseMsg, isAdmin } from "../../utils/util"
import SignInCard from "../SignIn/SignInCard"
import ProductForm from "./ProductForm"

const ProductAtrributes = ({ attrData, existingAttrs, callBack }) => {
    const { productId, img, TAX } = attrData;
    const initialState = {
        defaultImg: img,
        title: '',
        mrpPrice: 0,
        price: 0,
        tax: 0,
        totalPrice: 0,
        inStock: 0,
        description: '',
        content: '',
        discount: 0
    }
    const { state, dispatch } = useContext(DataContext)
    const { auth } = state
    const [attribute, setAttribute] = useState(initialState)
    const [images, setImages] = useState([])
    const [onEdit, setOnEdit] = useState(false)
    let delImages = useRef([])
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (!isEmpty(attrData.attribute)) {
            setOnEdit(true)
            setAttribute({ ...attribute, ...attrData.attribute })
            setImages(attrData.attribute.images ? attrData.attribute.images : []);
        }
    }, [attrData.attribute])

    const handleChangeInput = async e => {
        const { name, value } = e.target;
        setAttribute(populateProduct(name, value, TAX, attribute));
    }

    const handleUploadInput = e => {
        e.preventDefault();
        dispatch({ type: 'NOTIFY', payload: {} })
        const res = validateUploadInputs([...e.target.files], images.length, true);
        if (res.err) return dispatch({ type: 'NOTIFY', payload: { error: res.err } })
        setImages([...images, ...res.images]);
    }

    const handleImageDelete = (i, images) => {
        const newArr = [...images]
        delImages.current = newArr.splice(i, 1);
        setImages(newArr);
    }

    const handleCloudinaryImages = async (imgs) => {
        deleteImagesFromCloudinary(delImages.current, auth, productId, true, []);
        delImages.current = [];
        const handledImgs = await uploadImagesToCloudinary(imgs);
        setImages(handledImgs);
        return handledImgs;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        isAdmin(auth, dispatch);
        if (!attribute.title) return dispatch({ type: 'NOTIFY', payload: { error: 'Please add a product name.' } })
        if (!attribute.mrpPrice) return dispatch({ type: 'NOTIFY', payload: { error: 'Please add a product MRP price.' } })
        if (!attribute.price) return dispatch({ type: 'NOTIFY', payload: { error: 'Please add a product price.' } })
        if (!attribute.inStock || attribute.inStock === 0) return dispatch({ type: 'NOTIFY', payload: { error: 'Please add a product stock.' } })
        if (!attribute.description) return dispatch({ type: 'NOTIFY', payload: { error: 'Please add a product description.' } })
        if (!attribute.content) return dispatch({ type: 'NOTIFY', payload: { error: 'Please add a product content.' } })
        if (images.length === 0) return dispatch({ type: 'NOTIFY', payload: { error: 'Please add product image(s).' } })

        setIsLoading(true);
        const handledImages = await handleCloudinaryImages(images);
        const discount = calculateDiscountedPercentage(attribute.mrpPrice, attribute.totalPrice);
        const updatedAttrs = updateAttributes(existingAttrs, { ...attribute, discount, images: handledImages }, false);
        callBack(updatedAttrs);
        const res = await putData(`product/attributes/${productId}`, { attributes: updatedAttrs }, auth.token);
        handleResponseMsg(res, dispatch);
        setIsLoading(false);
    }

    //This line should be always below useEffect hooks
    if (isEmpty(auth) || isEmpty(auth.token)) return <SignInCard loadingMsg={SIGNING_MSG} delay />;

    return (
        <ProductForm
            isLoading={isLoading}
            product={attribute}
            images={images}
            handleChangeInput={handleChangeInput}
            handleUploadInput={handleUploadInput}
            handleImageDelete={handleImageDelete}
            handleSubmit={handleSubmit}
            onEdit={onEdit}
            isAttributes
            isSavedImg={img && img.url}
        />
    );
}

export default ProductAtrributes;