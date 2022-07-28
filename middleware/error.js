import { isLoggedInPopup } from "../components/SignIn/SignInCardFunctionalComponent";
import { CONTACT_ADMIN_ERR_MSG, ERRCODE_408, TOKEN_EXPIRED_ERROR } from "../utils/constants";
import * as log from "./log"


export const handleServerError = (methodName, err, errStatusCode, res) => {
    log.error(methodName, err);
    let errMsg = CONTACT_ADMIN_ERR_MSG;
    if (err.name === TOKEN_EXPIRED_ERROR) {
        errStatusCode = ERRCODE_408;
        errMsg = err.msg;
    }
    return res.status(errStatusCode).json({ code: errStatusCode, err: errMsg })
}

export const handleUIError = (err, errStatusCode, auth, dispatch) => {
    //console.error(` ${formatDateTime(new Date(), 'LTS ll')} : [ERROR] - : ${err}`);
    let errMsg = err;
    if (errStatusCode === ERRCODE_408) if (!isLoggedInPopup(auth, dispatch)) return;
    return dispatch({ type: 'NOTIFY', payload: { error: errMsg } });
}