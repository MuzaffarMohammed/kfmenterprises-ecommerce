import Link from "next/link"

function Error({ statusCode }) {
  return (
    <div className="centerDiv">
      <h1>Oops! <span style={{ fontSize: '24px' }}>
        Something's Missing...
      </span></h1>
      <button className='btn btn-primary mt-4' >
        <Link href="/" style={{ color: 'white' }}>
          Go back home
        </Link>
      </button>
    </div>
  )
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode }
}

export default Error