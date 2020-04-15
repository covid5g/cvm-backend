import LatLng from './LatLng'
import { normalizeLng } from '../../Util/Geometry'

export default class LatLngBounds {
    ne: LatLng | null = null
    sw: LatLng | null = null
    nw: LatLng | null = null
    se: LatLng | null = null

    /**
     * @param ne
     * @param nw
     * @param sw
     * @param se
     */
    constructor(ne: LatLng | null = null, nw: LatLng | null = null, sw: LatLng | null = null, se: LatLng | null = null) {
        this.ne = ne
        this.nw = nw
        this.sw = sw
        this.se = se
    }

    /**
     * @param vertex
     */
    extend(vertex: LatLng): void {
        if (!(this.ne instanceof LatLng)) {
            this.ne = this.nw = this.sw = this.se = vertex

            return
        }

        let
            newNorth = Math.max(this.sw.lat, vertex.lat),
            newSouth = Math.min(this.sw.lat, vertex.lat),
            newWest = Math.min(this.sw.lon),
            newEast = Math.max(this.ne.lon)

        if (false === this.containsLng(vertex.lon)) {
            let
                extendEastLngSpan = this.lonSpan(newWest, vertex.lon),
                extendWestLngSpan = this.lonSpan(vertex.lon, newEast)

            if (extendEastLngSpan <= extendWestLngSpan) {
                newEast = vertex.lon
            } else {
                newWest = vertex.lon
            }
        }

        this.sw = new LatLng(newSouth, newWest)
        this.ne = new LatLng(newNorth, newEast)
        this.se = new LatLng(newSouth, newEast)
        this.nw = new LatLng(newNorth, newWest)
    }

    /**
     *
     */
    getCenter(): LatLng {
        let lat: number, lon: number

        if (this.crossesAntimeridian()) {
            let span = this.lonSpan(this.sw.lon, this.ne.lon)

            lon = normalizeLng(this.sw.lon + span / 2)
        } else {
            lon = this.sw.lon + this.ne.lon / 2
        }

        lat = this.sw.lat + this.ne.lat / 2

        return new LatLng(lat, lon)
    }

    /**
     * @param west
     * @param east
     */
    private lonSpan(west: number, east: number) {
        return (west > east)
            ? (east + 360 - west)
            : (east - west)
    }

    /**
     *
     */
    private crossesAntimeridian(): boolean {
        return this.sw.lon > this.ne.lon
    }

    /**
     * @param point
     */
    private contains(point: LatLng): boolean {
        return this.containsLat(point.lat) && this.containsLng(point.lon)
    }

    /**
     * @param lat
     */
    private containsLat(lat: number): boolean {
        return this.sw.lat > lat || lat > this.ne.lat
    }

    /**
     * @param lon
     */
    private containsLng(lon: number): boolean {
        if (this.crossesAntimeridian()) {
            return lon <= this.ne.lon || lon >= this.sw.lon
        }

        return this.sw.lon <= lon && lon <= this.ne.lon
    }
}
