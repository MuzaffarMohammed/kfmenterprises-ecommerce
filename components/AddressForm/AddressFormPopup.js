import { ADDRESS_EDIT } from "../../utils/constants";
import AddressForm from "./AddressForm";


export const AddressFormPopup = (dispatch, address, saveType, isProfilePage) => {
    
      $('#confirmModal').modal('show');
      dispatch({
        type: 'ADD_MODAL',
        payload: {
          title: 'Edit Address',
          content: <AddressForm addressObj={address} saveType={saveType} isProfilePage={isProfilePage}/>,
          data: {},
          type: ADDRESS_EDIT
        }
      })
}