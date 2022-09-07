import { useContext, useEffect, useState } from "react";
import { DataContext } from "../../store/GlobalState";
import { ADDRESS_DEL, ADDRESS_EDIT, ADDRESS_GET, ADDRESS_NEW } from "../../utils/constants";
import { patchData, postData } from "../../utils/fetchData";
import isEmpty from 'lodash/isEmpty';
import { useRouter } from "next/router";
import { isLoading } from "../../utils/util";
import AddressForm from "../AddressForm/AddressForm";
import { AddressFormPopup } from "../AddressForm/AddressFormPopup";
import { updateAddress } from "../AddressForm/util";


const Address = ({ isProfilePage }) => {


    const [addresses, setAddresses] = useState([])
    const { state, dispatch } = useContext(DataContext)
    const { auth } = state
    const [newAddPanelVisible, setNewAddPanelVisible] = useState(false)
    const router = useRouter()

    useEffect(() => {
        if (auth && auth.user && auth.user.id) {
            isLoading(true, dispatch);
            postData(`user/${auth.user.id}`, { dataType: ADDRESS_GET }, auth.token)
                .then(res => {
                    isLoading(false, dispatch);
                    if (res.err) return dispatch({ type: 'NOTIFY', payload: { error: res.err } })
                    if (!isEmpty(res.addresses)) {
                        setAddresses(res.addresses);
                        res.addresses.every(address => {
                            if (address.default) {
                                dispatch({ type: 'ADD_ADDRESS', payload: address })
                                return false
                            }
                            return true;
                        });
                    }
                })
        }
    }, [auth])

    const handleSelectAddress = (selectedAddressIndex) => {
        if (selectedAddressIndex >= 0) {
            setNewAddPanelVisible(false);
            dispatch({ type: 'ADD_ADDRESS', payload: addresses[selectedAddressIndex] });
        }
        else {
            setNewAddPanelVisible(true);
            dispatch({ type: 'ADD_ADDRESS', payload: { new: '-1' } })
        }
    }

    const handleAddressChange = (i, saveType) => {
        if (saveType === ADDRESS_EDIT) return AddressFormPopup(dispatch, addresses[i], saveType, isProfilePage);
        else if (saveType === ADDRESS_DEL) {
            updateAddress(ADDRESS_DEL, addresses[i], dispatch, auth);
            return router.reload('/profile')
        }
    }

    return (
        <div>
            {
                !isEmpty(addresses) &&
                <>
                    {
                        addresses.map((item, i) => (
                            <div key={i}>
                                <div className={`row ${isProfilePage ? 'justify-content-between' : ''} `}>
                                    {!isProfilePage && <input className="mt-1" type="radio" value={i} name="rg-address" defaultChecked={item.default} onChange={e => { handleSelectAddress(e.target.value) }} />}
                                    <div className="col-8 pl-3">
                                        <label style={{ fontSize: '14px' }} className="mb-0 font-weight-bold text-black"> {item.fullName} {isProfilePage && <span className="font-weight-light text-success">{item.default ? '(Default)' : ''}</span>}</label>
                                        <p className="text-black" style={{ fontSize: '12px' }}>
                                            <span>
                                                {item.address},<br />
                                                {item.city}, {item.countryState},<br />
                                                {item.country}, {item.pincode}.<br />
                                                Phone number: {item.phoneNumber}.
                                            </span>
                                        </p>
                                    </div>
                                    {isProfilePage && <div>

                                        <a onClick={() => { handleAddressChange(i, ADDRESS_EDIT) }}><i className="fas fa-edit text-info mr-2" title="Edit"></i></a>
                                        <a onClick={() => { handleAddressChange(i, ADDRESS_DEL) }}><i className="fas fa-trash-alt text-info mr-2" title="Delete"></i></a>
                                    </div>
                                    }
                                </div>
                            </div>
                        ))
                    }
                    {!isProfilePage ? <h6 className="font-weight-bold text-black">-or-</h6> : <hr />}
                </>
            }
            <>
                <div className="pt-1 pb-2 row">
                    {!isProfilePage && <input type="radio" value="-1" name="rg-address" onClick={e => { handleSelectAddress(e.target.value) }}></input>}
                    {!isProfilePage ?
                        <p className="pl-3 mb-0 font-weight-bold text-black">Add a New Address</p>
                        :
                        <h5>Add a New Address</h5>
                    }
                </div>
                {newAddPanelVisible && <AddressForm addressObj={{}} saveType={ADDRESS_NEW} isProfilePage={isProfilePage} />}
                <hr />
            </>
        </div>
    );
}

export default Address;