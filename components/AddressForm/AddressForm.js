import { useRouter } from "next/router"
import { useContext, useEffect, useState } from "react"
import { DataContext } from "../../store/GlobalState"
import { CITIES_ARR, COUNTRIES_ARR, STATES_ARR } from "../../utils/constants"
import { getAddressObj, validateAddress } from "../Cart/util"
import Loading from "../Loading"
import { updateAddress } from "./util"

const AddressForm = ({ addressObj, saveType, isProfilePage }) => {

    const [fullName, setFullName] = useState('')
    const [city, setCity] = useState('')
    const [countryState, setCountryState] = useState('Telangana') // Need to change when more states get added
    const [country, setCountry] = useState('India')
    const [address, setAddress] = useState('')
    const [pincode, setPincode] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [isDefault, setIsDefault] = useState(false)

    const { state, dispatch } = useContext(DataContext)
    const { auth } = state
    const router = useRouter()

    useEffect(() => {
        if (addressObj) {
            setFullName(addressObj.fullName);
            setAddress(addressObj.address);
            setCity(addressObj.city);
            setCountryState(addressObj.countryState);
            setCountry(addressObj.country);
            setPincode(addressObj.pincode);
            setPhoneNumber(addressObj.phoneNumber);
            setIsDefault(addressObj.default);
        }
    }, [addressObj])


    const handleSaveAddress = (e) => {
        e.preventDefault();
        const address = getAddressObj(document.getElementById('addressForm'), isDefault, addressObj.fullName);
        const validateAddressMsg = validateAddress(address);
        if (validateAddressMsg) return dispatch({ type: 'NOTIFY', payload: { error: validateAddressMsg } });
        updateAddress(saveType, address, dispatch, auth);
        $('#confirmModal').modal('hide');
        return router.reload(isProfilePage ? '/profile' : '/cart');
    }

    return (
        <form id="addressForm">
            <label htmlFor="fullName">Full Name</label>
            <input type="text" name="fullName" id="fullName"
                className="form-control mb-2" value={fullName}
                maxLength="50"
                onChange={e => setFullName(e.target.value)} />
            <label htmlFor="address">Flat, House no., Building Name, Street Address</label>
            <textarea type="text" name="address" id="address"
                maxLength="50"
                className="form-control mb-2" value={address}
                onChange={e => setAddress(e.target.value)} />

            <div className="row">
                <div className="col-xl-4">
                    <label htmlFor="cities">City</label>
                    <select id="city" className="form-control mb-2 custom-select text-capitalize" onChange={e => setCity(e.target.value)}>
                        {
                            CITIES_ARR.map(item => (
                                <option value={item} key={item} selected={item === city}>{item}</option>
                            ))}
                    </select>
                </div>
                <div className="col-xl-4 pl-md-1">
                    <label htmlFor="state">State</label>
                    <select id="countryState" className="form-control mb-2 custom-select text-capitalize" onChange={e => setCountryState(e.target.value)}>
                        {
                            STATES_ARR.map(item => (
                                <option value={item} key={item} selected={item === countryState}>{item}</option>
                            ))
                        }
                    </select>
                </div>
                <div className="col-xl-4 pl-md-1">
                    <label htmlFor="country">Country</label>
                    <select id="country" className="form-control mb-2 custom-select text-capitalize" onChange={e => setCountry(e.target.value)}>
                        {
                            COUNTRIES_ARR.map((item) => (
                                <option value={item} key={item} selected={item === country}>{item}</option>
                            ))
                        }
                    </select>
                </div>
            </div>
            <div className="row">
                <div className="col-xl-6 pl-md-1">
                    <label htmlFor="pincode">Pin Code</label>
                    <input type="text" name="pincode" id="pincode"
                        className="form-control mb-2" value={pincode}
                        maxLength="10"
                        onChange={e => setPincode(e.target.value)} />
                </div>
                <div className="col-xl-6 pl-md-1">
                    <label htmlFor="phoneNumber">Phone Number</label>
                    <input type="text" name="phoneNumber" id="phoneNumber"
                        className="form-control mb-2" value={phoneNumber}
                        maxLength="10"
                        onChange={e => setPhoneNumber(e.target.value)} />
                </div>
            </div>
            {isProfilePage &&
                <div className="row pt-2">
                    <input className="mt-1" type='checkbox' checked={isDefault} onChange={(e) => setIsDefault(e.target.checked)} />
                    <p className="pl-2">Mark as default address</p>
                </div>
            }
            <button className="btn btn-primary my-2 cartPayBtn" onClick={handleSaveAddress}>Save Address</button>
        </form>
    )
}

export default AddressForm;