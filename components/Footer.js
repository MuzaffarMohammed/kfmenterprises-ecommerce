import React from 'react';
import Link from 'next/link'


const Footer = () => {
  return (
    <footer className='footer'>
      <div className='text-left'>
        <div className='container-fluid m-1 pt-1'>
          <div className="row" >
            <div className='col-md-6'>
              <Link href="/">
                <div className="d-flex align-items-end" style={{ cursor: 'pointer' }}>
                  <img src="/assets/images/icon/KFM_Logo_Small_Black.svg" alt="KFM Enterprises" />
                  <h4 style={{ marginBottom: '0px', marginLeft: '2px', color: 'white' }}>CART</h4>
                </div>
              </Link>
              <p className='pt-2'>KFM Cart, Purity is our priority, an ecommerce service, a part of KFM Enterprises Private Limited. We believe in hygienic, efficient and smooth delivery of all the items listed on our website. You are only a click away to place your order with KFM CART.</p>
              <p style={{ fontSize: '12px' }}><strong>Address:</strong> Hyderabad, Telangana-500028, India <br></br><strong>Phone:</strong> +91 8247732147<br></br><strong>Email:</strong> kfmcart@gmail.com</p>
            </div>

            <div className='col-md-3 footermenu pl-lg-3'>
              <h6>Get to Know Us</h6>
              <ul className='list-unstyled mb-0'>
                <li><a href='/' className='text-light text-hover'>Home</a></li>
                <li><a href='/contactus' className='text-light text-hover'>Careers</a></li>
                <li>
                  <a href='#!' className='text-light text-hover'>
                    About Us
                  </a>
                </li>
                <li>
                  <a href='/contactus' className='text-light text-hover'>
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href='/privacyPolicy' className='text-light text-hover'>
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href='/conditionsofuse' className='text-light text-hover'>
                    Conditions of Use
                  </a>
                </li>
              </ul>
            </div>

            <div className='col-md-3 footermenu'>
              <h6>Connect with Us</h6>

              <ul className='list-unstyled'>
                <li>
                  <a href='#!' className='text-light text-hover'>
                    Facebook
                  </a>
                </li>
                <li>
                  <a href='#!' className='text-light text-hover'>
                    Twitter
                  </a>
                </li>
                <li>
                  <a href='#!' className='text-light text-hover'>
                    Instagram
                  </a>
                </li>
                <li>
                  <a href='#!' className='text-light text-hover'>
                    linkedin
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className='p-3 row bottomStrip justify-content-center'>

          <a className='text-light'> &copy; {new Date().getFullYear()}{' '} KFM Enterprises Private Limited.</a>

          <a className='text-light ml-2 text-hover' style={{paddingTop: '0px'}}href='https://appseonit.com'>
            Designed By Appseonit Technologies Private Limited.
          </a>
        </div>
      </div>
    </footer>
  );
}
export default Footer;