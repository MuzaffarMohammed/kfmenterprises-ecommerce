import Head from 'next/head'
import Dashboard from '../components/Dashboard/Dashboard';


const dashboard = () => {

    return (
        <>
            <Head>
                <title>KFM Cart - Dashboard</title>
            </Head>
            <Dashboard />
        </>
    );
}
export default dashboard;