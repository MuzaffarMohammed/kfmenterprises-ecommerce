import Head from 'next/head'
import Notifications from '../components/Notifications/Notifications';


const notifications = () => {

    return (
        <div className="container justify-content-between">
            <Head>
                <title>KFM Cart - Notifications</title>
            </Head>
            <Notifications />
        </div>
    );
}
export default notifications;