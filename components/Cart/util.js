import { ADDRESS_EDIT } from "../../utils/constants";

export const getAddressObj = (form, isDefault, oldFullName) => {
  var address = {};
  if (form && form.elements) {
    const values = form.elements;
    address = {
      oldFullName,
      fullName: values.fullName && values.fullName.value,
      address: values.address && values.address.value,
      city: values.city && values.city.value,
      countryState: values.countryState && values.countryState.value,
      country: values.country && values.country.value,
      pincode: values.pincode && values.pincode.value,
      phoneNumber: values.phoneNumber && values.phoneNumber.value
    }
    if (isDefault) address = { ...address, default: true }
  }
  return address;
}

export const validateAddress = (address) => {
  const numRegex = /^[0-9]+$/;
  if (!address) return 'Please select a address to proceed further.';
  if (!address.fullName || !address.address || !address.phoneNumber || !address.city || !address.countryState || !address.country || !address.pincode) return 'Please add all your details to proceed further.';
  if (address.fullName && address.fullName.length < 4) return 'Please enter a valid Full Name to proceed further.';
  if (!(address.address.length >= 15)) return 'Please add address like (Flat, House no., Building Name, Street Address) only.';
  if (address.city == "-Select-") return 'Please select a City.';
  if (address.countryState == "-Select-") return 'Please select a State.';
  if (address.country == "-Select-") return 'Please select a Country.';
  if (!(numRegex.test(address.pincode)) || !(address.pincode.length >= 6 || address.pincode.length >= 10)) return 'Please enter a valid Pin Code.';
  if (!(numRegex.test(address.phoneNumber)) || !(address.phoneNumber.length >= 10)) return 'Please enter a valid Phone Number.';
}