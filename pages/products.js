import Head from 'next/head'
import { ProductList } from '../components/product/ProductList';

const products = () => {

    return (
        <div className="container justify-content-between">
            <Head>
                <title>KFM Cart - Products</title>
            </Head>
            <ProductList />
        </div>
    );
}
export default products;