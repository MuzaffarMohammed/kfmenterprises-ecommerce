import { SIGN_IN } from "../../utils/constants";
import SignInCard from "./SignInCard";

export const isLoggedInPopup = (auth, dispatch, cb) => {
    if (!auth || !auth.user) {
      $('#confirmModal').modal('show');
      dispatch({
        type: 'ADD_MODAL',
        payload: {
          title: 'Please Sign In',
          content: <SignInCard isPopUp={true} executeSignInCallback={cb}/>,
          data: {},
          type: SIGN_IN
        }
      })
      return dispatch({ type: 'NOTIFY', payload: { error: 'Please sign in to proceed further!' } });
    } else return true;
}