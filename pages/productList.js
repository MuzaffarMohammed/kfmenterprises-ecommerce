import Head from 'next/head'
import { ProductList } from '../components/product/ProductList';

const products = () => {

    return (
        <div className="container-fluid justify-content-between">
            <Head>
                <title>KFM Cart - Product List</title>
            </Head>
            <ProductList />
        </div>
    );
}
export default products;