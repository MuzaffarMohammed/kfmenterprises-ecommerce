import Head from 'next/head'
import MyAccount from '../components/Profile/MyAccount';
import ProfileTabs from '../components/Profile/ProfileTabs/ProfileTabs';

const Profile = () => {

    return (
        <div className="container-fluid row profile_page">
            <Head>
                <title>KFM Cart - Profile</title>
            </Head>
            <div className='col-md-4'>
                <MyAccount />
            </div>
            <div className='col-md-8 mt-4'>
                <ProfileTabs />
            </div>
        </div>
    )
}

export default Profile;