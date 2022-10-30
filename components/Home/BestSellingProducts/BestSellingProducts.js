import Slider from "react-slick"
import ProductItem from "../../product/ProductItem"

export const BestSellingProducts = ({ bsProducts }) => {

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
        <>
            <h5>Best Selling Products</h5>
            <Slider {...settings}>
                {
                    bsProducts && bsProducts.length !== 0 ? bsProducts.map(product => (
                        <div key={product._id} className="productsCarousel">
                            <ProductItem key={product._id} product={product} />
                        </div>
                    )) : <h2>No Products</h2>
                }
            </Slider>
        </>
    )
}