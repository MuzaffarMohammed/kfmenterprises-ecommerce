function Error({ statusCode }) {
  return (
    <div className="centerDiv">
      <p style={{fontWeight:'bold'}}>
        {statusCode
          ? `An error ${statusCode} occurred on server! Please contact administrator.`
          : 'An error occurred on browser! Please try refreshing your screen.'}
      </p>
    </div>
  )
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode }
}

export default Error