import Head from 'next/head'
import { useState, useContext, useEffect, useRef } from 'react'
import { DataContext } from '../../store/GlobalState'
import { imageUpload } from '../../utils/imageUpload'
import { postData, getData, putData, deleteData } from '../../utils/fetchData'
import { useRouter } from 'next/router'
import { isAdmin, isLoggedIn, renameFile } from '../../utils/util'
import isEmpty from 'lodash/isEmpty';

const ProductsManager = (props) => {
    const initialState = {
        title: '',
        mrpPrice:0,
        price: 0,
        tax: 0,
        totalPrice: 0,
        inStock: 0,
        description: '',
        content: '',
        category: '',
        number: 0,
        discount: Math.floor(Math.random() * 70) + 1
    }
    const TAX = 0.02;
    const Product_ = 'Product_';
    const _Image_ = '_Image_';
    const [product, setProduct] = useState(initialState)
    const { title, mrpPrice, price, inStock, tax, totalPrice, description, content, category } = product
    const calcTotalPrice = (actPrice, calctTaxAmount) => (Number(actPrice) + calctTaxAmount);
    const calcTaxAmount = (actPrice) => Math.abs(Number(actPrice) * TAX)
    const [images, setImages] = useState([])
    let delImages = useRef([])
    const [taxAmount, setTaxAmount] = useState(tax)
    const [totalAmount, setTotalAmount] = useState(totalPrice)
    const [totalProducts, setTotalProducts] = useState(props.totalProducts)
    const { state, dispatch } = useContext(DataContext)
    const { categories, auth } = state

    const router = useRouter()
    const { id } = router.query
    const [onEdit, setOnEdit] = useState(false)

    // useEffect(() => {
    //     console.log('auth : ', auth)
    //     isLoggedIn(auth, dispatch, router);

    // }, [])

    useEffect(() => {
        console.log('id : ', id)
        if (id) {
            setOnEdit(true)
            getData(`product/${id}`).then(res => {
                const calcTax = calcTaxAmount(res.product.price);
                setTaxAmount(calcTax);
                const calcTotal = calcTotalPrice(res.product.price, calcTax);
                setTotalAmount(calcTotal);
                setProduct({ ...res.product, tax: calcTax.toFixed(2), totalPrice: calcTotal.toFixed(2), discount: product.discount })
                setImages(res.product.images);
            })
        } else {
            setOnEdit(false)
            const calcTax = calcTaxAmount(product.price);
            setTaxAmount(calcTax);
            const calcTotal = calcTotalPrice(product.price, calcTax);
            setTotalAmount(calcTotal);
            setProduct({ ...initialState, tax: calcTax.toFixed(2), totalPrice: calcTotal.toFixed(2) })
            setImages([]);
        }
    }, [id])

    const handleChangeInput = async e => {
        const { name, value } = e.target;
        if (name === 'price') {
            const calcTax = calcTaxAmount(value);
            setTaxAmount(calcTax);
            const calcTotal = calcTotalPrice(value, calcTax);
            setTotalAmount(calcTotal);
            setProduct({ ...product, [name]: value, tax: calcTax.toFixed(2), totalPrice: calcTotal.toFixed(2) })
        } else {
            setProduct({ ...product, [name]: value });
        }
        dispatch({ type: 'NOTIFY', payload: {} });
    }


    const existingAllImgArr = (imgs) => {
        const existingImgArr = [];
        imgs.forEach(file => {
            if (file.url && file.url.indexOf(Product_) !== -1 && file.url.indexOf(_Image_) !== -1) {
                existingImgArr.push(parseInt(file.url.split(Product_)[1].split(_Image_)[1].split('.')[0]));
            }
        });
        return existingImgArr;
    }
    const getSucceedingFileNo = (existingImgArr, imgNo) => {
        while (existingImgArr.indexOf(imgNo) !== -1) ++imgNo;
        return imgNo;
    }

    const handleUploadInput = e => {
        dispatch({ type: 'NOTIFY', payload: {} })
        let newImages = []
        let err = ''
        const files = [...e.target.files]
        let existingImgCount = images.length;

        if (files.length === 0) return dispatch({ type: 'NOTIFY', payload: { error: 'Files does not exist.' } })
        if (existingImgCount + files.length > 5) return dispatch({ type: 'NOTIFY', payload: { error: 'Select upto 5 images only!' } })
        const existingImgArr = existingAllImgArr(images);
        files.forEach(file => {
            if (file.size > 1024 * 1024) return err = 'The largest image size is 1mb'
            if (file.type !== 'image/jpeg' && file.type !== 'image/png') return err = 'Image format is incorrect.'

            const imgNo = getSucceedingFileNo(existingImgArr, ++existingImgCount);
            const fileExtn = file.name.split('.').pop();
            if (!onEdit) file = renameFile(file, Product_ + totalProducts + _Image_ + imgNo + '.' + fileExtn);
            else file = renameFile(file, Product_ + product.number + _Image_ + imgNo + '.' + fileExtn);
            newImages.push(file);
        })
        if (err) dispatch({ type: 'NOTIFY', payload: { error: err } })
        setImages([...images, ...newImages]);
    }

    const deleteImage = index => {
        const newArr = [...images]
        delImages.current = newArr.splice(index, 1);
        setImages(newArr);
    }

    const deleteImagesFromCloudinary = (imgsTodelete) => {
        let publicIds = [];
        imgsTodelete.map(img => { if (img.public_id) publicIds.push(img.public_id) });
        if (publicIds) deleteData(`uploads/delete`, auth.token, { publicIds });
        delImages.current = [];
    }

    const handleCloudinaryImages = async (imgs) => {
        deleteImagesFromCloudinary(delImages.current);
        let newUploadedImgsURLs = [];
        const imgsToUpload = imgs.filter(img => !img.url)
        const oldImgsURLs = imgs.filter(img => img.url)
        if (imgsToUpload.length > 0) {
            newUploadedImgsURLs = await imageUpload(imgsToUpload, 'product');
            const handledImgs = [...oldImgsURLs, ...newUploadedImgsURLs];
            setImages(handledImgs);
            return handledImgs;
        }
        return images;
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        isAdmin(auth, dispatch);
        if (!title) return dispatch({ type: 'NOTIFY', payload: { error: 'Please add a product name.' } })
        if (!mrpPrice) return dispatch({ type: 'NOTIFY', payload: { error: 'Please add a product MRP price.' } })
        if (!price) return dispatch({ type: 'NOTIFY', payload: { error: 'Please add a product price.' } })
        if (!inStock || inStock === 0) return dispatch({ type: 'NOTIFY', payload: { error: 'Please add product stock.' } })
        if (!description) return dispatch({ type: 'NOTIFY', payload: { error: 'Please add a product description.' } })
        if (!content) return dispatch({ type: 'NOTIFY', payload: { error: 'Please add a product content.' } })
        if (category === '' || category === 'all') return dispatch({ type: 'NOTIFY', payload: { error: 'Please add a product category.' } })
        if (images.length === 0) return dispatch({ type: 'NOTIFY', payload: { error: 'Please add product images.' } })

        dispatch({ type: 'NOTIFY', payload: { loading: true } })
        const handledImages = await handleCloudinaryImages(images);
        let res;
        if (onEdit) {
            res = await putData(`product/${id}`, { ...product, images: handledImages }, auth.token)
            if (res.err) return dispatch({ type: 'NOTIFY', payload: { error: res.err } })
        } else {
            res = await postData('product', { ...product, number: totalProducts, images: handledImages }, auth.token)
            if (res.err) return dispatch({ type: 'NOTIFY', payload: { error: res.err } })
        }
        return dispatch({ type: 'NOTIFY', payload: { success: res.msg } })
    }

    return (
        <div className="container-fluid products_manager">
            <Head>
                <title>KFM Cart - Products Manager</title>
            </Head>
            <form className="row my-3" onSubmit={handleSubmit}>
                <div className="col-xl-6 col-xs-12">
                    <div className="row mx-1">
                        <div className="col-sm-12">
                            <label htmlFor="title">Product Name</label>
                            <input type="text" name="title" value={product.title}
                                placeholder="Title" className="d-block w-100 p-2"
                                onChange={handleChangeInput}
                                maxLength='25'
                            />
                        </div>
                        <div className="row">
                         <div className="col-md-2 mt-1">
                                <label htmlFor="mrpPrice">MRP Price</label>
                                <input type="number" name="mrpPrice" value={product.mrpPrice}
                                    placeholder="Price" className="d-block w-100 p-2"
                                    onChange={handleChangeInput} 
                                    maxLength='5'
                                    />
                            </div>
                            <div className="col-md-2 mx-lg-3 mt-1">
                                <label htmlFor="price">Your Price</label>
                                <input type="number" name="price" value={product.price}
                                    placeholder="Price" className="d-block w-100 p-2"
                                    onChange={handleChangeInput} 
                                    maxLength='5'
                                    />
                            </div>
                            <div className="col-md-2 mx-lg-1 mt-1">
                                <label htmlFor="tax">Tax (2%)</label>
                                <input type="text" name="tax" value={product.tax}
                                    placeholder="Tax" className="d-block w-100 p-2"
                                    disabled
                                    onChange={handleChangeInput}
                                />
                            </div>
                            <div className="col-md-2 mx-lg-3 mt-1">
                                <label htmlFor="total">Total Price</label>
                                <input type="text" name="total" value={product.totalPrice}
                                    placeholder="Total Price" className="d-block w-100 p-2"
                                    onChange={handleChangeInput}
                                    disabled
                                />
                            </div>
                            <div className="col-lg-2 col-md-3 mx-lg-1 mt-1">
                                <label htmlFor="inStock">In Stock</label>
                                <input type="number" name="inStock" value={product.inStock}
                                    placeholder="inStock" className="d-block w-100 p-2"
                                    onChange={handleChangeInput}
                                    maxLength='5'
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row mx-1">
                        <textarea name="description" id="description" cols="30" rows="3"
                            placeholder="Description" onChange={handleChangeInput}
                            className="d-block my-sm-4 mt-3 w-100 p-2" value={product.description}
                            maxLength='250'
                        />
                    </div>
                    <div className="row mx-1">
                        <textarea name="content" id="content" cols="30" rows="6"
                            placeholder="Content" onChange={handleChangeInput}
                            className="d-block my-sm-2 mt-3 w-100 p-2" value={product.content}
                            maxLength='700'
                        />
                    </div>
                    <div className="row mx-1">
                        <div className="col mt-2">
                            <div className="input-group-prepend px-0 my-2">
                                <select name="category" id="category" value={category}
                                    onChange={handleChangeInput} className="custom-select text-capitalize">
                                    <option value="all">All</option>
                                    {
                                        categories.map(item => (
                                            <option key={item._id} value={item._id}>
                                                {item.name}
                                            </option>
                                        ))
                                    }
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-xl-5 col-xs-12 mx-md-4 mx-xs-3 mt-5 mt-md-0 justify-content-md-center">
                    Click to browse and upload your images
                    <div className="input-group mt-2 mb-3">
                        <div className="input-group-prepend">
                            <span className="input-group-text">Upload</span>
                        </div>
                        <div className="custom-file border">
                            <input type="file" className="custom-file-input" placeholder="Click here to upload"
                                onChange={handleUploadInput} multiple accept="image/*" />
                        </div>
                    </div>
                    <div className="row img-up mx-0">
                        {
                            images.map((img, index) => (
                                <div key={index} className="file_img my-1">
                                    <img src={img.url ? img.url : URL.createObjectURL(img)}
                                        alt="" className="img-thumbnail rounded my-1" />

                                    <span onClick={() => deleteImage(index)}>X</span>
                                </div>
                            ))
                        }
                    </div>
                </div>

                <div className="row col-xl-12 mt-2 justify-content-center">
                    <button type="submit" className="btn btn-primary w-100">
                        {onEdit ? 'Update' : 'Create'}
                    </button>
                </div>
            </form>
        </div>
    )
}

export async function getServerSideProps({ params: { id } }) {

    const res = await getData(`product?limit=99999999&category=all&sort=''&title=all`)
    // server side rendering
    return {
        props: { totalProducts: res && res.result + 1 }, // will be passed to the page component as props
    }
}

export default ProductsManager