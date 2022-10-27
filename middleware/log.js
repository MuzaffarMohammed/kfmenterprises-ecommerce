import { formatDateTime } from "../utils/util";


export const info = (msg) => {
    return console.log(` ${formatDateTime(new Date(), 'LTS ll')} : [INFO] - ${msg}`);
}

export const debug = (msg) => {
    if (process.env.NEXT_PUBLIC_SHOW_DEBUG_LOG) {
        return console.error(` ${formatDateTime(new Date(), 'LTS ll')} : [DEBUG] - ${msg}`);
    } else return;
}

export const error = (methodName, err) => {
    return console.error(` ${formatDateTime(new Date(), 'LTS ll')} : [ERROR] - ${methodName} : ${err}`);
}