import Head from 'next/head'
import { useState, useContext, useEffect, useRef } from 'react'
import { DataContext } from '../../store/GlobalState'
import { postData, getData, putData } from '../../utils/fetchData'
import { useRouter } from 'next/router'
import { calcTaxAmount, calcTotalPrice, calculateDiscountedPercentage, handleResponseMsg, isAdmin, parseNumDecimalType } from '../../utils/util'
import { deleteImagesFromCloudinary, populateProduct, uploadImagesToCloudinary, validateUploadInputs } from '../../utils/productManagerUtil'
import SignInCard from '../../components/SignIn/SignInCard'
import { SIGNING_MSG } from '../../utils/constants'
import { isEmpty } from 'lodash'
import ProductForm from '../../components/ProductManager/ProductForm'
import { openProductAtrributesPopup } from '../../components/ProductManager/ProductAtrributesPopup'
import { handleUIError } from '../../middleware/error'

const ProductsManager = () => {
    const TAX = process.env.NEXT_PUBLIC_RAZORPAY_TAX;
    const initialState = {
        title: '',
        mrpPrice: 0,
        price: 0,
        tax: 0,
        totalPrice: 0,
        inStock: 0,
        description: '',
        content: '',
        number: 0,
        categories: 'all',
        discount: 0,
        attributes: [],
        attributesRequired: false
    }
    const [product, setProduct] = useState(initialState)
    const [categories, setCategories] = useState('')
    const [images, setImages] = useState([])
    let delImages = useRef([])
    const { state, dispatch } = useContext(DataContext)
    const { categories: categoriesList, auth } = state
    const [attributesRequired, setAttributesRequired] = useState(false);
    const router = useRouter()
    const { id: productId } = router.query
    const [onEdit, setOnEdit] = useState(false)

    useEffect(() => {
        debugger;
        if (productId) {
            setOnEdit(true)
            getData(`product/${productId}`).then(res => {
                const calcTax = calcTaxAmount(res.product.price, TAX);
                setCategories(res.product.categories);
                res.product.attributes && res.product.attributes.forEach(attr => { if (attr.defaultImg && attr.defaultImg.url && attr.defaultImg.public_id) imgs.push(attr.defaultImg) })
                setProduct({ ...res.product, tax: calcTax, totalPrice: calcTotalPrice(res.product.price, calcTax) })
                setImages(res.product && res.product.images ? res.product.images: []);
                console.log('res.product.attributesRequired :',(res.product && res.product.attributesRequired))
                setAttributesRequired(res.product && res.product.attributesRequired);
            })
        } else {
            setOnEdit(false)
            const calcTax = calcTaxAmount(product.price, TAX);
            setCategories('all')
            setProduct({ ...initialState, tax: calcTax, totalPrice: calcTotalPrice(product.price, calcTax) })
            setImages([]);
        }
    }, [productId])

    const handleChangeInput = async e => {
        const { name, value } = e.target;
        const parsedVal = parseNumDecimalType(value, e.target.type);
        if (name === 'category') setCategories(parsedVal);
        else setProduct(populateProduct(name, parsedVal, TAX, product));
    }

    const handleUploadInput = e => {
        e.preventDefault()
        dispatch({ type: 'NOTIFY', payload: {} })
        const res = validateUploadInputs([...e.target.files], images.length, false);
        if (res.err) return dispatch({ type: 'NOTIFY', payload: { error: res.err } })
        setImages([...images, ...res.images]);
    }

    const handleImageDelete = (index, images) => {
        const newArr = [...images]
        delImages.current = newArr.splice(index, 1);
        setImages(newArr);
    }

    const handleCloudinaryImages = async (imgs) => {
        deleteImagesFromCloudinary(delImages.current, auth, productId, false, product.attributes);
        delImages.current = [];
        const handledImgs = await uploadImagesToCloudinary(imgs);
        setImages(handledImgs);
        return handledImgs;
    }

    const handleImageClick = (img) => {
        if (!onEdit) return dispatch({ type: 'NOTIFY', payload: { error: 'Please create the product first to include its attributes!' } })
        const callBack = (updatedAttrs) => product.attributes = updatedAttrs;
        let attribute = !isEmpty(product.attributes) && product.attributes.filter(attr => attr.defaultImg && attr.defaultImg.public_id === img.public_id)[0];
        attribute = attribute ? attribute : { ...product, images: [] };
        delete attribute.attributes;
        openProductAtrributesPopup({ productId, attribute, img, TAX }, product.attributes, callBack, dispatch);
    }

    const handleAttributesRequired = e =>{
       //e.preventDefault();
        console.log('e.checked : ',e.target.checked);
        setAttributesRequired(e.target.checked);
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        isAdmin(auth, dispatch);
        if (!product.title) return dispatch({ type: 'NOTIFY', payload: { error: 'Please add a product name.' } })
        if (!product.mrpPrice) return dispatch({ type: 'NOTIFY', payload: { error: 'Please add a product MRP price.' } })
        if (!product.price) return dispatch({ type: 'NOTIFY', payload: { error: 'Please add a product price.' } })
        if (!product.inStock || product.inStock === 0) return dispatch({ type: 'NOTIFY', payload: { error: 'Please add a product stock.' } })
        if (!product.description) return dispatch({ type: 'NOTIFY', payload: { error: 'Please add a product description.' } })
        if (!product.content) return dispatch({ type: 'NOTIFY', payload: { error: 'Please add a product content.' } })
        if (categories === '' || categories === 'all') return dispatch({ type: 'NOTIFY', payload: { error: 'Please add a product category.' } })
        if (images.length === 0) return dispatch({ type: 'NOTIFY', payload: { error: 'Please add product image(s).' } })

        dispatch({ type: 'NOTIFY', payload: { loading: true } })
        const handledImages = await handleCloudinaryImages(images);
        const discount = calculateDiscountedPercentage(product.mrpPrice, product.totalPrice);
        let res;
        const data = { ...product, discount, categories, images: handledImages, attributesRequired};
        if (onEdit) res = await putData(`product/${productId}`, data, auth.token)
        else res = await postData('product?type=CP', data, auth.token);
        if (res.code) return handleUIError(res.err, res.code, undefined, dispatch);
        else if (res.msg) {
            console.log('res.productId : ', res.productId)
            dispatch({ type: 'NOTIFY', payload: { success: res.msg } })
            if (res.productId) router.push('/create/' + res.productId);
        }
    }

    //This line should be always below useEffect hooks
    if (isEmpty(auth) || isEmpty(auth.token)) return <SignInCard loadingMsg={SIGNING_MSG} delay />;

    return (
        <div className="container-fluid products_manager">
            <Head>
                <title>KFM Cart - Product Manager</title>
            </Head>
            <ProductForm
                product={product}
                images={images}
                handleChangeInput={handleChangeInput}
                handleUploadInput={handleUploadInput}
                handleImageClick={handleImageClick}
                handleImageDelete={handleImageDelete}
                handleAttributesRequired={handleAttributesRequired}
                handleSubmit={handleSubmit}
                categories={categories}
                categoriesList={categoriesList}
                onEdit={onEdit}
                isAttributes={false}
                attributesRequired={attributesRequired}
            />
        </div>
    )
}

export default ProductsManager