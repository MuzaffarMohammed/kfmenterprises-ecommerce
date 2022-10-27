import Head from 'next/head'
import { Products } from '../components/product/Products';

const products = () => {

    return (
        <div className="container justify-content-between">
            <Head>
                <title>KFM Cart - Products</title>
            </Head>
            <Products />
        </div>
    );
}
export default products;