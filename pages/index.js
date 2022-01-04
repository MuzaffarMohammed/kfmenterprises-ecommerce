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
const Home = (props) => {
  const [products, setProducts] = useState(props.products)
  const [bsProducts, setBsProducts] = useState(props.bestSellingProds)
  const [isCheck, setIsCheck] = useState(false)
  const [page, setPage] = useState(1)
  const router = useRouter()

  const { state, dispatch } = useContext(DataContext)
  const { auth } = state

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

  const handleDeleteAll = () => {
    let deleteArr = [];
    products.forEach(product => {
      if (product.checked) {
        deleteArr.push({
          data: '',
          id: product._id,
          title: 'Delete all selected products?',
          type: 'DELETE_PRODUCT'
        })
      }
    })

    dispatch({ type: 'ADD_MODAL', payload: { data: deleteArr, type: 'DELETE_PRODUCT', content: 'Do you want to delete this item?' } })
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

      <div className="container-fluid p-0">
        <Filter state={state} />

        {
          auth.user && auth.user.role === 'admin' &&
          <div className="delete_all btn btn-danger mt-2 mx-2" style={{ marginBottom: '-10px' }}>
            <input type="checkbox" checked={isCheck} onChange={handleCheckALL}
              style={{ width: '25px', height: '25px', transform: 'translateY(8px)' }} />
            <button className="btn btn-danger ml-2"
              data-toggle="modal" data-target="#confirmModal"
              onClick={handleDeleteAll}>
              DELETE ALL
            </button>
          </div>
        }
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