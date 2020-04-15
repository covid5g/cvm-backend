import { EARTH_RADIUS, phi, toBrng, toDeg, toRad } from '../../Util/Geometry'

export default class LatLng {
    lat: number
    lon: number

    /**
     * @param lat
     * @param lon
     */
    constructor(lat: number = 0, lon: number = 0) {
        this.lat = lat
        this.lon = lon
    }

    /**
     * @param dest
     */
    rhumbBearingTo(dest: LatLng): number {
        let
            dLon = toRad(dest.lon - this.lon),
            dPhi = phi(this.lat, dest.lat)

        if (Math.abs(dLon) > Math.PI) {
            dLon = dLon > 0 ? -(2 * Math.PI - dLon) : (2 * Math.PI + dLon)
        }

        return toBrng(Math.atan2(dLon, dPhi))
    }

    /**
     * @param brng
     * @param dist
     */
    rhumbDestinationLatLng(brng: number, dist: any): LatLng | null {
        let d = parseFloat(dist) / EARTH_RADIUS  // d = angular distance covered on earth's surface
        let lat1 = toRad(this.lat), lon1 = toRad(this.lon)

        brng = toRad(brng)

        let lat2 = lat1 + d * Math.cos(brng)
        let dLat = lat2 - lat1
        let dPhi = phi(lat1, lat2)

        let q = (Math.abs(dLat) > 1e-10) ? dLat / dPhi : Math.cos(lat1)
        let dLon = d * Math.sin(brng) / q

        // check for going past the pole
        if (Math.abs(lat2) > Math.PI / 2) {
            lat2 = lat2 > 0 ? Math.PI - lat2 : -(Math.PI - lat2)
        }

        let lon2 = (lon1 + dLon + Math.PI) % (2 * Math.PI) - Math.PI

        if (isNaN(lat2) || isNaN(lon2)) {
            return null
        }

        return new LatLng(toDeg(lat2), toDeg(lon2))
    }
}
