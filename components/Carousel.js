import { useState } from 'react'
import Carousel from 'react-bootstrap/Carousel'
import { DataContext } from '../store/GlobalState'


function ControlledCarousel() {
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };

  return (
    <Carousel className="test">

      <Carousel.Item interval={3000} className="gradient01">
        <div className="row justify-content-center">
          <div className="col-xl-6 col-md-6">
            <h4>Large varieties of Grocery and Food Items</h4>
            <p>Delivery at your door step with safety measures.</p>
          </div>
          <div className="col-xl-4 col-md-4">
            <img
              className="d-block carouselImg"
              src="/assets/images/carouselImage/groceries.png"
              alt="First slide"
            />
          </div>
        </div>
      </Carousel.Item>

      <Carousel.Item interval={3000} className="gradient02">
        <div className="row justify-content-center">
          <div className="col-xl-6 col-md-6">
            <h4>Large varieties of Desi Kitchen Spices</h4>
            <p>Indian spices that go beyond flavours.</p>
          </div>
          <div className="col-xl-4 col-md-4">
            <img
              className="d-block carouselImg"
              src="/assets/images/carouselImage/indianSpices.png"
              alt="First slide"
            />
          </div>
        </div>
      </Carousel.Item>

      <Carousel.Item interval={3000} className="gradient03">
        <div className="row justify-content-center">
          <div className="col-xl-6 col-md-6">
            <h4 style={{ marginLeft: '35px' }}>Authentic Hyderabadi Dum Biryani cooked in Clay Pot</h4>
            <p>Purity & hygiene is our priority.</p>
          </div>
          <div className="col-xl-4 col-md-4">
            <img
              className="d-block carouselImg"
              src="/assets/images/carouselImage/potBiryani.png"
              alt="Third slide"
            />
          </div>
        </div>
      </Carousel.Item>
    </Carousel>
  );
}

export default ControlledCarousel
