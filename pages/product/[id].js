import Head from 'next/head'
import { useState, useEffect, useContext } from 'react'
import { getData } from '../../utils/fetchData'
import { DataContext } from '../../store/GlobalState'
import { addToCart } from '../../store/Actions'
import { ProductPrice } from '../../components/product/ProductPrice'
import Slider from "react-slick"
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { array } from 'prop-types'


const DetailProduct = (props) => {
    const [product, setProduct] = useState(props.product)

    const [productTitle, setProductTitle] = useState();
    const [subProductTitle, setSubProductTitle] = useState();
    const [prodPriceData, setProdPriceData] = useState([]);
    const [prodDescription, setProdDescription] = useState();
    const [prodContent, setProdContent] = useState();
    const [prodDisplayImagesUrl, setProdDisplayImagesUrl] =useState(['']);
    const [updateImagesUrl, setUpdateImagesUrl] =useState(['']);
    const [productSizes, setProductSizes] = useState([]);

    const [tab, setTab] = useState(0)
    const [tab1, setTab1] = useState(0)

    const { state, dispatch } = useContext(DataContext)
    const { cart, auth } = state
    const isAdmin = auth && auth.user && auth.user.role === 'admin'

    useEffect(() => {
        // setProductTitle(product.title);
        // setProdDescription(product.description);
        // setProdContent(product.content)
        let obj ={
            mrpPrice : product.mrpPrice,
            price : product.price,
            totalPrice : product.totalPrice,
            inStock : product.inStock
        };
        setProdPriceData(obj)
        defaultProduct();
           }, [])

    const defaultProduct =()=>{
       
        let singleProdArray = [];
        let multiProductArray = [];
        let productSizes = [];
        product.attributes.map((data)=>{
            setSubProductTitle(data.title)
            setProdDescription(data.description);
                    setProdContent(data.content);
            multiProductArray.push(data.defaultImg)
            data.images.map((imgs)=>{if(data.isDisplay){singleProdArray.push(imgs)}})
            data.sizes.map((size)=>{if(data.isDisplay){productSizes.push(size)}})
        })
        setProdDisplayImagesUrl(multiProductArray)
        setUpdateImagesUrl(singleProdArray)
        setProductSizes(productSizes)
    }
    const isActive = (index) => {
        if (tab === index) return " active";
        return ""
    }

    const isActive1 = (index) => {
        if (tab1 === index) return " active";
        return ""
    }

    const dispatchAddToCart = () => {
        const res = addToCart(product, cart);
        dispatch(res)
        if (res.type === "ADD_CART") dispatch({ type: 'NOTIFY', payload: { success: 'Product is added to cart.' } })
    }

    const updatedProdData =(data)=>{
         let obj ={
            mrpPrice : data.mrpPrice,
            price : data.price,
            totalPrice : data.totalPrice,
            inStock : data.inStock
        };
        setProdPriceData(obj);
    }

    const updateImages =(url)=>{
        let ImgsArray = [];
        let productSizes = [];

        if(product.attributes !== null && product.attributes !== null && product.attributes !== undefined){
        product.attributes.map((data) => {
                  
                if(data.defaultImg.public_id == url.public_id){
                    setSubProductTitle(data.title);
                    setProdDescription(data.description);
                    setProdContent(data.content)

                    {data.sizes.map((sizeMrp)=>{
                        productSizes.push(sizeMrp)
                        if(sizeMrp.isDisplay){
                        let obj ={
                            mrpPrice : sizeMrp.mrpPrice,
                            price : sizeMrp.price,
                            totalPrice : sizeMrp.totalPrice,
                            inStock : sizeMrp.inStock
                        };
    
                        setProdPriceData(obj)}
                    })}
                    setProductSizes(productSizes)

                   
                { data.images !== null && data.images !== undefined ? data.images.map((img)=>{
                     ImgsArray.push(img);
                }) : ""}
              }
            
        
        });
        setUpdateImagesUrl(ImgsArray)
    }else{
        ImgsArray.push(url);
    }
}

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1
    };

    return (
        <div className="container-fluid row detail_page">
            <Head>
                <title>KFM Cart - Product Detail</title>
            </Head>
            <h1 className="col-xl-12 text-center mt-2 mb-0 text-capitalize" title={product.title} style={{fontSize:'24px'}}>
                {product.title}
            </h1>
            <h4 className="col-xl-12 text-center mt-2 mb-0 text-capitalize" title={product.title}>
                {subProductTitle}
            </h4>
            <div className="col-xl-5 col-xs-12">
                <img src={updateImagesUrl[tab].url} alt={product.title}
                    className="d-block img-thumbnail rounded mt-2 w-100 prodDetailImg" />
                <div className="prodDetialmultiImgs row mx-0 mt-1" style={{ cursor: 'pointer' }} >
                    {updateImagesUrl.map((img, index) => (
                        <img key={index} src={img.url}
                            className={`img-thumbnail rounded ${isActive(index)}`}
                            style={{ height: '100%', width: '20%' }}
                            onClick={() => setTab(index)} />
                    ))}
                </div>
            </div>


            <div className="col-xl-6 col-xs-12 mt-3 mx-xl-5">
                <div>
                    <div className="col-xl-12 col-xs-12">
                        <div className=" mx-0 mt-1" style={{ cursor: 'pointer' }} >
                            <Slider {...settings}>
                                {prodDisplayImagesUrl.map((img, index) => (
                                    <div key={index} className="img-card">
                                        <img key={index} src={img.url}
                                            className={`img-thumbnail rounded ${isActive1(index)}`}
                                            style={{ height: '50%', width: '100%' }}
                                            onClick={() => {updateImages(img); setTab1(index)}} />
                                    </div>
                                ))}
                            </Slider>
                        </div>
                    </div>

                    <div className="col-xl-12 col-xs-12 mt-5" style={{margin:'5%'}}>
                        {productSizes.map((sizesData, subIndex) => (
                                    <span key={subIndex} className="productSizeSelected" onClick={() => updatedProdData(sizesData)} >{sizesData.length}X{sizesData.breadth}</span>

                        ))}
                    </div>

                    <div>
                        <ProductPrice product={product} isAdmin={isAdmin} isProductDetailPage={true} productTitle={productTitle}  prodPriceData={prodPriceData}/>
                    </div>
                    <button className="btn btn-success d-block my-2 px-5"
                        disabled={isAdmin ? true : false}
                        onClick={() => { dispatchAddToCart() }} >
                        Add to Cart
                        <i className="fas fa-shopping-cart pl-1" aria-hidden="true" ></i>
                    </button>

                    <div className="my-3">
                        <h5>Description</h5>
                        {prodDescription}
                    </div>
                    <div className="my-3">
                        <h5>About this item</h5>
                        {prodContent}
                    </div>
                </div>
            </div>
        </div>
    )
}

export async function getServerSideProps({ params: { id } }) {

    const res = await getData(`product/${id}`)
    // server side rendering
    return {
        props: { product: res.product }, // will be passed to the page component as props
    }
}


export default DetailProduct