import React from 'react';
import Link from 'next/link'


const Footer = () => {
  return (
    <footer className='footer'>
    <div  className='text-center text-lg-left'>
    <div className='container p-4'>
      <div className="row" >
        <div  className='col-md-6'>
        <Link href="/">
                <img src="/assets/images/icon/KFM_FooterLogo.svg" style={{cursor:'pointer'}} alt="KFM Enterprises" width="30%" />
            </Link>
          <br></br>
          <br></br>
          <p>Hyderabad, Telangana 500028, India <br></br><strong>Phone:</strong> +91 8247732147<br></br><strong>Email:</strong> kfmcart@gmail.com</p>
          {/* <div class="social-links mt-3">
          <a href="#" class="twitter"><i class="fab fa-twitter"></i></a>
          <a href="#" class="facebook"><i class="fab fa-facebook"></i></a>
          <a href="#" class="instagram"><i class="fab fa-instagram"></i></a>
          <a href="#" class="linkedin"><i class="fab fa-linkedin"></i></a>
          </div> */} 
        </div>

        <div className='col-md-3 footermenu'>
          <h6>Get to Know Us</h6>

          <ul className='list-unstyled mb-0'>
            <li>
              <a href='/' className='text-light'>
              Home
              </a>
            </li>
            <li>
              <a href='#!' className='text-light'>
               About Us
              </a>
            </li>
            <li>
              <a href='/contactus' className='text-light'>
               Contact Us
              </a>
            </li>
            <li>
              <a href='/' className='text-light'>
              Privacy Policy
              </a>
            </li>
            <li>
              <a href='/' className='text-light'>
               Conditions of Use
              </a>
            </li>
          </ul>
        </div>

        <div className='col-md-3 footermenu'>
          <h6>Connect with Us</h6>

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

    <div className='text-center p-3 row bottomStrip'>
     <div className="col-xl-3"></div>
     
      <a className='text-light col-xl-3'> &copy; {new Date().getFullYear()}{' '} KFM Enterprises Private Limited.</a>
      
      <a className='text-light col-xl-3' href='https://appseonit.com'>
         Designed By Appseonit Technologies Private Limited.
      </a>
      
      <div className="col-xl-3"></div>
    </div>
  </div>
  </footer>
  );
}
export default Footer;