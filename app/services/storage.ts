export function getItem(name: string) {
    return localStorage.getItem(name)
}

export function setItem(name: string, value: string) {
    localStorage.setItem(name, value)
}