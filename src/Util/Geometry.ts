/**
 * @param angle
 */
const toRad = (angle: number): number => {
    return angle * Math.PI / 180
}

/**
 * @param angle
 */
const toDeg = (angle: number): number => {
    return angle * 180 / Math.PI
}

/**
 * @param number
 */
const toBrng = (number: number): number => {
    return (toDeg(number) + 360) % 360
}

/**
 * @param start
 * @param dest
 */
const phi = (start: number, dest: number): number => {
    return Math.log(Math.tan(toRad(dest) / 2 + Math.PI / 4) / Math.tan(toRad(start) / 2 + Math.PI / 4))
}

/**
 * @param a
 * @param b
 */
const fmod = (a: number, b: number): number => {
    return Number((a - (Math.floor(a / b) * b)).toPrecision(8))
}

/**
 * @param lat
 */
const normalizeLat = (lat: number): number => {
    return Math.max(-90, Math.min(90, lat))
}

/**
 * @param lng
 */
const normalizeLng = (lng: number): number => {
    if (lng % 360 === 180) {
        return 180
    }

    let mod = fmod(lng, 360)

    return mod < -180
        ? mod + 360
        : (
            mod > 180
                ? mod - 360
                : mod
        )
}

// Constants
export const EARTH_RADIUS = 6378//137 // in KM

// Geodesic functions
export {toRad, toDeg, toBrng, phi, fmod}

// other utilities
export {normalizeLat, normalizeLng}