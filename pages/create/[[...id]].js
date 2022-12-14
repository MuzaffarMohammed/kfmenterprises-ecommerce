import Head from 'next/head'
import { useState, useContext, useEffect, useRef } from 'react'
import { DataContext } from '../../store/GlobalState'
import { postData, getData, putData } from '../../utils/fetchData'
import { useRouter } from 'next/router'
import { calcTaxAmount, calcTotalPrice, calculateDiscountedPercentage, handleResponseMsg, isAdmin } from '../../utils/util'
import { deleteImagesFromCloudinary, populateProduct, uploadImagesToCloudinary, validateUploadInputs } from '../../utils/productManagerUtil'
import SignInCard from '../../components/SignIn/SignInCard'
import { SIGNING_MSG } from '../../utils/constants'
import { isEmpty } from 'lodash'
import ProductForm from '../../components/ProductManager/ProductForm'

const ProductsManager = () => {
    const TAX = 0.02;
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
        discount: 0
    }
    const [product, setProduct] = useState(initialState)
    const [categories, setCategories] = useState('')
    const [images, setImages] = useState([])
    let delImages = useRef([])
    const { state, dispatch } = useContext(DataContext)
    const { categories: categoriesList, auth } = state

    const router = useRouter()
    const { id } = router.query
    const [onEdit, setOnEdit] = useState(false)

    useEffect(() => {
        if (id) {
            setOnEdit(true)
            getData(`product/${id}`).then(res => {
                const calcTax = calcTaxAmount(res.product.price, TAX);
                setCategories(res.product.categories);
                setProduct({ ...res.product, tax: calcTax, totalPrice: calcTotalPrice(res.product.price, calcTax) })
                setImages(res.product.images);
            })
        } else {
            setOnEdit(false)
            const calcTax = calcTaxAmount(product.price, TAX);
            setCategories('all')
            setProduct({ ...initialState, tax: calcTax, totalPrice: calcTotalPrice(product.price, calcTax) })
            setImages([]);
        }
    }, [id])

    const handleChangeInput = async e => {
        const { name, value } = e.target;
        if (name === 'category') setCategories(value);
        else setProduct(populateProduct(name, value, TAX, product));
    }

    const handleUploadInput = e => {
        dispatch({ type: 'NOTIFY', payload: {} })
        const res = validateUploadInputs([...e.target.files], images.length);
        if (res.err) dispatch({ type: 'NOTIFY', payload: { error: err } })
        setImages([...images, ...res.images]);
    }

    const handleImageDelete = (index, images) => {
        const newArr = [...images]
        delImages.current = newArr.splice(index, 1);
        setImages(newArr);
    }

    const handleCloudinaryImages = async (imgs) => {
        deleteImagesFromCloudinary(delImages.current, auth);
        delImages.current = [];
        const handledImgs = await uploadImagesToCloudinary(imgs);
        setImages(handledImgs);
        return handledImgs;
    }

    const handleImageClick = (img, index) => {
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
        if (onEdit) res = await putData(`product/${id}`, { ...product, discount, categories, images: handledImages }, auth.token)
        else res = await postData('product', { ...product, discount, categories, images: handledImages }, auth.token)
        handleResponseMsg(res, dispatch);
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
                categories={categories}
                categoriesList={categoriesList}
                onEdit={onEdit}
            />
        </div>
    )
}

export async function getServerSideProps({ params: { id } }) {

    const res = await getData(`product?limit=99999999&category=all&sort=''`)
    // server side rendering
    return {
        props: { totalProducts: res && res.count + 1 }, // will be passed to the page component as props
    }
}

export default ProductsManager