export function getItem(name) {
    return localStorage.getItem(name);
}
export function setItem(name, value) {
    localStorage.setItem(name, value);
}
export function push(name, value) {
    let arrValue;
    try {
        arrValue = getJson(name);
        if (arrValue.constructor !== Array) {
            arrValue = [];
        }
    }
    catch (e) {
        arrValue = [];
    }
    arrValue.push(value);
    setItem(name, JSON.stringify(arrValue));
}
export function getJson(name) {
    return JSON.parse(localStorage.getItem(name));
}
