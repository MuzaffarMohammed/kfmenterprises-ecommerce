import React from 'react';
import Link from 'next/link'


const Footer = () => {
  return (
    <div  className='text-center text-lg-left' style={{color:"white", backgroundColor: "#232F3E"}}>
    <div className='p-4'>
      <div className="container row" >
        <div  className='mb-4 mb-md-0 col-md-6'>
        <Link href="/">
                <img src="/assets/images/icon/KFM_FooterLogo.svg" style={{cursor:'pointer'}} alt="KFM Enterprises" width="30%" />
            </Link>

          <p>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iste atque ea quis molestias. Fugiat
            pariatur maxime quis culpa corporis vitae repudiandae aliquam voluptatem veniam, est atque
            cumque eum delectus sint!
          </p>
        </div>

        <div className='mb-4 mb-md-0 col-md-3'>
          <h5>Get to Know Us</h5>

          <ul className='list-unstyled mb-0'>
            <li>
              <a href='#!' className='text-light'>
              About Us
              </a>
            </li>
            <li>
              <a href='#!' className='text-light'>
                Link 2
              </a>
            </li>
            <li>
              <a href='#!' className='text-light'>
                Link 3
              </a>
            </li>
            <li>
              <a href='#!' className='text-light'>
                Link 4
              </a>
            </li>
          </ul>
        </div>

        <div className='mb-4 mb-md-0 col-md-3'>
          <h5>Connect with Us</h5>

          <ul className='list-unstyled'>
            <li>
              <a href='#!' className='text-light'>
              Facebook
              </a>
            </li>
            <li>
              <a href='#!' className='text-light'>
              Twitter
              </a>
            </li>
            <li>
              <a href='#!' className='text-light'>
              Instagram
              </a>
            </li>
            <li>
              <a href='#!' className='text-light'>
              linkedin
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div className='text-center p-3' style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
      &copy; {new Date().getFullYear()}{' '}
      <a className='text-light' href='https://mdbootstrap.com/'>
        KFM Enterpreises Pvt Ltd.
      </a>
    </div>
  </div>
  );
}
export default Footer;