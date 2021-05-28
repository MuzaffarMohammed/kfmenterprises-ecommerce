import { useState } from 'react'
import Carousel from 'react-bootstrap/Carousel'
import {DataContext} from '../store/GlobalState'


function ControlledCarousel() {
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };

  return (
    <Carousel className="test">

    <Carousel.Item interval={2500} className="gradient01">
       {/* <div className="carousel-item"></div> */}
      <div className="row">
      <div className="col-xl-6 col-md-6">
      <h3>Large varities of grocery and food items</h3>
          <p>Delivery at your door step with safty measures</p>
      </div>
      <div className="col-xl-6 col-md-6">
          <img
           className="d-block carouselImg"
           src="/assets/images/carouselImage/groceries.png"
           alt="First slide"
        /> 
      </div>
      </div>
     </Carousel.Item>

     <Carousel.Item interval={2500} className="gradient02">
     <div className="row">
      <div className="col-xl-6 col-md-6">
          <h3>Large varities of desi kitchen spices</h3>
          <p>Indian spices that go beyond flavors</p>
      </div>
      <div className="col-xl-6 col-md-6">
      <img
           className="d-block carouselImg"
           src="/assets/images/carouselImage/indianSpices.png"
           alt="First slide"
        /> 
      </div>
      </div>
     </Carousel.Item>

     <Carousel.Item interval={2500} className="gradient03">
     <div className="row">
      <div className="col-xl-6 col-md-6">
          <h3 style={{marginLeft:'35px'}}>Authentic Hyderabadi Dum Biryani Cooked in Clay Pot</h3>
          <p>Purity & hygiene is our priority.</p>
      </div>
      <div className="col-xl-6 col-md-6">
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
