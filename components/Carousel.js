import { useState } from 'react'
import Carousel from 'react-bootstrap/Carousel'


function ControlledCarousel() {
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };

  return (
    <Carousel>
    <Carousel.Item interval={2500}>
    <img
      className="d-block w-100"
      src="/assets/images/carouselImage/honey.jpg"
      alt="First slide"
    />
    <Carousel.Caption>
      <h3>large varities of grocery items</h3>
      <p>Purity is our priority.</p>
    </Carousel.Caption>
     </Carousel.Item>
     <Carousel.Item interval={2500}>
      <img
      className="d-block w-100"
      src="/assets/images/carouselImage/spice.jpg"
      alt="Second slide"
      />
     <Carousel.Caption>
      <h3>Second slide label</h3>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
      </Carousel.Caption>
     </Carousel.Item>
     <Carousel.Item interval={2500}>
     <img
      className="d-block w-100"
      src="/assets/images/carouselImage/potBiryani.jpg"
      alt="Third slide"
      />
      <Carousel.Caption>
      <h3>Third slide label</h3>
      <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
     </Carousel.Caption>
     </Carousel.Item>
     </Carousel>
  );
}

export default ControlledCarousel
