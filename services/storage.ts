export function getItem(name: string) {
    return localStorage.getItem(name)
}

export function setItem(name: string, value: string) {
    localStorage.setItem(name, value)
}

export function push(name: string, value: any) {
    let arrValue: any[] 
    try {
        arrValue = getJson(name)
        if (arrValue.constructor !== Array) {
            arrValue = []
        }
    } catch (e) {
        arrValue = []
    }
    arrValue.push(value);
    setItem(name, JSON.stringify(arrValue))
}

export function getJson(name: string): any {
    return JSON.parse(localStorage.getItem(name))
}