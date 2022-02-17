import { SIGN_IN } from "../../utils/constants";
import SignInCard from "./SignInCard";

export const isLoggedIn = (auth, dispatch) => {
    if (!auth || !auth.user) {
      $('#confirmModal').modal('show');
      dispatch({
        type: 'ADD_MODAL',
        payload: {
          title: 'Please Sign in',
          content: <SignInCard isPopUp={true}/>,
          data: {},
          type: SIGN_IN
        }
      })
      return dispatch({ type: 'NOTIFY', payload: { error: 'Please sign in to proceed further!' } });
    } else return true;
}