import { isEmpty } from "lodash"
import { useContext, useEffect, useRef, useState } from "react"
import { handleUIError } from "../../middleware/error"
import { DataContext } from "../../store/GlobalState"
import { SIGNING_MSG } from "../../utils/constants"
import { putData } from "../../utils/fetchData"
import { deleteImagesFromCloudinary, populateProduct, updateAttributes, uploadImagesToCloudinary, validateSizes, validateUploadInputs } from "../../utils/productManagerUtil"
import { calculateDiscountedPercentage, isAdmin, parseNumDecimalType } from "../../utils/util"
import SignInCard from "../SignIn/SignInCard"
import { sizeTypeList } from "./ProductAttributesUtil"
import ProductForm from "./ProductForm"

const ProductAtrributes = ({ attrData, existingAttrs, callBack }) => {
    const { productId, img, TAX } = attrData;
    const initialState = {
        defaultImg: img,
        title: '',
        description: '',
        content: '',
        selectedSizeType: 'select',
        color: '',
        shape: '',
        sizes: []
    }
    const { state, dispatch } = useContext(DataContext)
    const { auth } = state
    const [attribute, setAttribute] = useState(initialState)
    const [images, setImages] = useState([])
    const [onEdit, setOnEdit] = useState(false)
    let delImages = useRef([])
    const [isLoading, setIsLoading] = useState(false)
    let sizes = useRef([]);
    let selectedSizeType = useRef();
    let isDisplayProductChanged = useRef(false);

    useEffect(() => {
        if (!isEmpty(attrData.attribute)) {
            setOnEdit(true);
            setAttribute({ ...attrData.attribute, defaultImg: initialState.defaultImg })
            setImages(attrData.attribute.images ? attrData.attribute.images : []);
        }
    }, [attrData.attribute])

    const handleChangeInput = async e => {
        const { name, value } = e.target;
        const parsedVal = parseNumDecimalType(value, e.target.type);
        setAttribute(populateProduct(name, parsedVal, TAX, attribute));
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

    const handleSizes = (sizeArr, isProdDisplayChanged) => {
        isDisplayProductChanged.current = isProdDisplayChanged;
        if (sizeArr) {
            sizes.current = sizeArr;
            selectedSizeType.current = sizeArr[0].type;
            setAttribute({ ...attribute, selectedSizeType: selectedSizeType.current, sizes: sizes.current });
        } else return dispatch({ type: 'NOTIFY', payload: { error: 'Size must be define for a Product Attribute.' } })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        isAdmin(auth, dispatch);
        $('#link-sizes').trigger("click");
        if (!attribute.title) return dispatch({ type: 'NOTIFY', payload: { error: 'Please add a product name.' } })
        if (!selectedSizeType.current || selectedSizeType.current === 'select') return dispatch({ type: 'NOTIFY', payload: { error: 'Please choose a product size type.' } })
        if (!validateSizes(sizes.current)) return dispatch({ type: 'NOTIFY', payload: { error: "Product size details can't be zero." } })
        // if (!attribute.mrpPrice) return dispatch({ type: 'NOTIFY', payload: { error: 'Please add a product MRP price.' } })
        // if (!attribute.price) return dispatch({ type: 'NOTIFY', payload: { error: 'Please add a product price.' } })
        // if (!attribute.inStock || attribute.inStock === 0) return dispatch({ type: 'NOTIFY', payload: { error: 'Please add a product stock.' } })
        if (!attribute.color) return dispatch({ type: 'NOTIFY', payload: { error: 'Please add a product color.' } })
        if (!attribute.shape) return dispatch({ type: 'NOTIFY', payload: { error: 'Please add a product shape.' } })
        if (!attribute.description) return dispatch({ type: 'NOTIFY', payload: { error: 'Please add a product description.' } })
        if (!attribute.content) return dispatch({ type: 'NOTIFY', payload: { error: 'Please add a product content.' } })
        if (images.length === 0) return dispatch({ type: 'NOTIFY', payload: { error: 'Please add product image(s).' } })

        setIsLoading(true);
        const handledImages = await handleCloudinaryImages(images);
        const discount = calculateDiscountedPercentage(attribute.mrpPrice, attribute.totalPrice);
        const newAttr = { ...attribute, selectedSizeType: selectedSizeType.current, sizes: sizes.current, discount, images: handledImages };
        const updatedAttrs = updateAttributes(existingAttrs, newAttr, false, [], isDisplayProductChanged.current);
        callBack(updatedAttrs);
        const res = await putData(`product/attributes/${productId}`, { attributes: updatedAttrs }, auth.token);
        setIsLoading(false);
        if (res.code) return handleUIError(res.err, res.code, undefined, dispatch);
        else if (res.msg) return dispatch({ type: 'NOTIFY', payload: { success: res.msg } });
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
            handleSizes={handleSizes}
            onEdit={onEdit}
            isAttributes
            isSavedImg={img && img.url}
            sizeTypeList={sizeTypeList}
        />
    );
}

export default ProductAtrributes;