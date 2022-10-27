import { useRouter } from "next/router";
import { patchData } from "../../utils/fetchData";
import { isLoading } from "../../utils/util";

export const updateAddress = (dataType, updateAddress, dispatch, auth) => {
    if (auth && auth.token) {
        isLoading(true, dispatch);
        patchData(`user`, { dataType, address: updateAddress }, auth.token)
            .then(res => {
                isLoading(false, dispatch);
                if (res.err) return dispatch({ type: 'NOTIFY', payload: { error: res.err } })
                if (res.msg) return dispatch({ type: 'NOTIFY', payload: { success: res.msg } })
            })
    }
}