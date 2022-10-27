import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import Address from '../../Cart/Address';

const ProfileTabs = () => {

    return (
        <>
            <Tabs defaultActiveKey="addresses">
                <Tab eventKey="addresses" title="Addresses">
                    <div className='container pl-4 pt-4'>
                        <h5>Saved Addresses</h5>
                        <Address isProfilePage={true}/>
                    </div>
                </Tab>
            </Tabs>
        </>
    )
}
export default ProfileTabs;