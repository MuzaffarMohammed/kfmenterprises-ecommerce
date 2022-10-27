import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import Address from '../../Cart/Address';
import { isAdminRole } from '../../../utils/util';
import { useContext } from 'react';
import { DataContext } from '../../../store/GlobalState';

const ProfileTabs = () => {

    const { state } = useContext(DataContext)
    const { auth } = state

    return (
        <>
            {
                (auth && auth.user && !isAdminRole(auth.user.role)) &&
                <Tabs defaultActiveKey="addresses">
                    <Tab eventKey="addresses" title="Addresses">
                        <div className='container pl-4 pt-4'>
                            <h5>Saved Addresses</h5>
                            <Address isProfilePage={true} />
                        </div>
                    </Tab>
                </Tabs>
            }
        </>
    )
}
export default ProfileTabs;