import Head from 'next/head'
import { useState, useContext, useEffect } from 'react'
import { DataContext } from '../store/GlobalState'
import { getData } from '../utils/fetchData'
import ControlledCarousel from '../components/Carousel'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import HomePageCards from '../components/HomePageCards'
import { isAdminRole } from '../utils/util'
import { ShopByCategories } from '../components/Home/Categories/ShopByCategories'
import { BestSellingProducts } from '../components/Home/BestSellingProducts/BestSellingProducts'
import { CategoryDisplayItems } from '../components/Home/Categories/CategoryDisplayItems'

const Home = (props) => {

  const [bsProducts, setBsProducts] = useState(props.bestSellingProds)
  const { state, dispatch } = useContext(DataContext)
  const { auth, categories } = state
  const isAdmin = auth && auth.user && isAdminRole(auth.user.role);

  useEffect(() => {
    setBsProducts(props.bestSellingProds)
  }, [props.bestSellingProds])

  return (
    <div className="home_page">
      <Head>
        <title>KFM Cart - Home</title>
      </Head>

      <div className="carousel image img-fluid">
        <ControlledCarousel />
        <div className="bestSellCaroIndicators">
          <BestSellingProducts bsProducts={bsProducts} />
        </div>
        <div>
          <HomePageCards />
        </div>
      </div>
      <div className='row pt-3 pb-4 card justify-content-center'>
        <ShopByCategories categories={categories} />
      </div>
      <div className='container-fluid p-0'>
        <CategoryDisplayItems categories={categories} />
      </div>
    </div>
  )
}


export async function getServerSideProps({ query }) {

  const bestSellingProds = await getData(`product?limit=5&category=all&sort=-sold&title=`)

  // server side rendering
  return {
    props: {
      bestSellingProds: bestSellingProds.products
    }, // will be passed to the page component as props
  }
}

export default Home