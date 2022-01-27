import Document, {Html, Head, Main, NextScript} from 'next/document'

class MyDocument extends Document{
    render(){
        return(
            <Html lang="en">
                <Head>
                    <meta name="description" content="KFM Enterprises E-Commerce Website"/>
                    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
                    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css" />
                    <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/js/bootstrap.bundle.min.js"></script>
                    <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
                    <script src="https://kit.fontawesome.com/a3140e7c2c.js" crossOrigin="anonymous"></script>
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}

export default MyDocument