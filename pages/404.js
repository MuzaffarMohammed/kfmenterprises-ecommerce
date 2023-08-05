import Link from 'next/link'

export default function FourOhFour() {
  return <>
    <div className='centerDiv'>
      <h1>Oops! <span style={{fontSize:'24px'}}>Page Not Found</span></h1>
      <button className='btn btn-primary mt-4' >
      <Link href="/">
        <a style={{color:'white'}}>
          Go back home
        </a>
      </Link>
      </button>
    </div>
  </>
}