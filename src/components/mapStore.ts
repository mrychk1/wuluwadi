// mapStore.js
let map: any = null;

export function setMap(mapInstance: any) {
    map = mapInstance;
}

export function getMap() {
    return map;
}