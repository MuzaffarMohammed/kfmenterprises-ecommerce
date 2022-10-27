import Head from 'next/head'
import { useState, useContext, useEffect } from 'react'
import { DataContext } from '../store/GlobalState'

import { getData } from '../utils/fetchData'
import ProductItem from '../components/product/ProductItem'
import filterSearch from '../utils/filterSearch'
import { useRouter } from 'next/router'
import Filter from '../components/Filter'
import ControlledCarousel from '../components/Carousel'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import HomePageCards from '../components/HomePageCards'
import AdminHomePage from '../components/AdminHomePage/AdminHomePage'
const Home = (props) => {
  const [products, setProducts] = useState(props.products)
  const [bsProducts, setBsProducts] = useState(props.bestSellingProds)
  const [isCheck, setIsCheck] = useState(false)
  const [page, setPage] = useState(1)
  const router = useRouter()

  const { state, dispatch } = useContext(DataContext)
  const { auth } = state
  const isAdmin = auth && auth.user && auth.user.role === 'admin';

  useEffect(() => {
    setProducts(props.products)
    setBsProducts(props.bestSellingProds)
  }, [props.products, props.bestSellingProds])

  useEffect(() => {
    if (Object.keys(router.query).length === 0) setPage(1)
  }, [router.query])

  const handleCheck = (id) => {
    products.forEach(product => {
      if (product._id === id) product.checked = !product.checked
    })
    setProducts([...products])
  }

  const handleCheckALL = () => {
    products.forEach(product => product.checked = !isCheck)
    setProducts([...products])
    setIsCheck(!isCheck)
  }

  const handleLoadmore = () => {
    setPage(page + 1)
    filterSearch({ router, page: page + 1 }, '/', false)
  }

  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    speed: 4000,
    autoplaySpeed: 2000,
    cssEase: "linear"
  };

  return (
    <div className="home_page">
      <Head>
        <title>KFM Cart - Home</title>
      </Head>

      <div className="carousel image img-fluid">
        <ControlledCarousel />
        <HomePageCards />
        <div className="bestSellCaroIndicators">
          <h2>BEST SELLING PRODUCTS</h2>
          <Slider {...settings}>
            {
              bsProducts && bsProducts.length !== 0 ? bsProducts.map(product => (
                <div key={product._id} className="productsCarousel">
                  <ProductItem key={product._id} product={product} handleCheck={handleCheck} />
                </div>
              )) : <h2>No Products</h2>
            }
          </Slider>
        </div>
      </div>
      {isAdmin && <AdminHomePage products={products} handleCheckALL={handleCheckALL} isAdmin={isAdmin} dispatch={dispatch} isCheck={isCheck} />}
      <div className="container-fluid p-0">
        <Filter state={state} />
      </div>
      <div className="products">
        {
          products.length === 0
            ? <h2>No Products</h2>
            : products.map(product => (
              <ProductItem key={product._id} product={product} handleCheck={handleCheck} />
            ))
        }
      </div>
      {
        props.result < page * 6 ? ""
          : <button className="btn btn-outline-primary d-block mx-auto mb-4"
            onClick={handleLoadmore}>
            See All
          </button>
      }
    </div>
  )
}


export async function getServerSideProps({ query }) {
  const page = query.page || 1
  const category = query.category || 'all'
  const sort = query.sort || ''
  const search = query.search || 'all'

  const res = await getData(
    `product?limit=${page * 6}&category=${category}&sort=${sort}&title=${search}`
  )

  const bestSellingProds = await getData(
    `product?limit=5&category=all&sort=-sold&title=`
  )

  // server side rendering
  return {
    props: {
      products: res.products,
      result: res.result,
      bestSellingProds: bestSellingProds.products
    }, // will be passed to the page component as props
  }
}

export default Home