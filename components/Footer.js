import React from 'react';
import Link from 'next/link'


const Footer = () => {
  return (
    <footer className='footer'>
    <div  className='text-center text-lg-left'>
    <div className='p-4'>
      <div className="container row" >
        <div  className='mb-4 mb-md-0 col-md-6'>
        <Link href="/">
                <img src="/assets/images/icon/KFM_FooterLogo.svg" style={{cursor:'pointer'}} alt="KFM Enterprises" width="30%" />
            </Link>
          <br></br>
          <br></br>
          <p>
            Contact No -
          </p>
          <p>
             Nawab Sahab Kunta, Jahanuma, Mir Alam Talab, <br></br> Hyderabad, Telangana, India, 500053
          </p>
        </div>

        <div className='mb-4 mb-md-0 col-md-3'>
          <h5>Get to Know Us</h5>

          <ul className='list-unstyled mb-0'>
            <li>
              <a href='#!' className='text-light'>
              Home
              </a>
            </li>
            <li>
              <a href='#!' className='text-light'>
               About Us
              </a>
            </li>
            <li>
              <a href='#!' className='text-light'>
                Cart
              </a>
            </li>
            <li>
              <a href='#!' className='text-light'>
               Sign In
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
     <div>
      &copy; {new Date().getFullYear()}{' '}
      <a className='text-light' href='https://kfmcart.com/'>
        KFM Enterprises Private Limited.
      </a>
      </div>
      <div>
      <a className='text-light p-5' href='https://appseonit.com'>
         Designed By Appseonit Technologies Private Limited.
      </a>
      </div>
    </div>
  </div>
  </footer>
  );
}
export default Footer;