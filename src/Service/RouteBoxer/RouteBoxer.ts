import LatLng from './LatLng'
import LatLngBounds from './LatLngBounds'
import { EARTH_RADIUS, toRad } from '../../Util/Geometry'

export default class RouteBoxer {
    /**
     * @param {Array<any>} _grid Two dimensional array representing the cells in the grid overlaid on the path
     */
    private _grid: number[][]

    /**
     * @param {Array<any>} _latGrid Array that holds the latitude coordinate of each vertical grid line
     */
    private readonly _latGrid: any[]
    /**
     * @param {Array<any>} _lonGrid Array that holds the longitude coordinate of each horizontal grid line
     */
    private readonly _lonGrid: any[]

    /**
     * @param {Array<any>} _boxesX Array of bounds that cover the whole route formed by merging cells that
     * the route intersects first horizontally, and then vertically
     */
    private readonly _boxesX: any[]
    /**
     * @param {Array<any>} _boxesY Array of bounds that cover the whole route formed by merging cells that
     * the route intersects first vertically, and then horizontally
     */
    private readonly _boxesY: any[]

    constructor() {
        this._grid = []

        this._latGrid = []
        this._lonGrid = []

        this._boxesX = []
        this._boxesY = []
    }

    /**
     * Generates boxes for a given route and distance
     *
     * @param {Array<LatLng>} vertices The path along which to create boxes.
     * @param {number} range The distance in kms around the route that the generated boxes must cover.
     *
     * @return {Array<LatLngBounds>} An array of boxes that covers the whole path.
     */
    box(vertices: Array<LatLng>, range: number = 10): Array<LatLngBounds> {
        // Build the grid that is overlaid on the route
        this.buildGrid(vertices, range)

        // Identify the grid cells that the route intersects
        this.findIntersectingCells(vertices)

        // Merge adjacent intersected grid cells (and their neighbours) into two sets
        //  of bounds, both of which cover them completely
        this.mergeIntersectingCells()

        // Return the set of merged bounds that has the fewest elements
        return (this._boxesX.length <= this._boxesY.length) ? this._boxesX : this._boxesY
    }

    /**
     * Generates boxes for a given route and distance
     *
     * @param {Array<LatLng>} vertices The vertices of the path over which to lay the grid
     * @param {number} range The spacing of the grid cells.
     */
    buildGrid(vertices: Array<LatLng>, range: number): void {
        // Create a LatLngBounds object that contains the whole path
        const routeBounds = new LatLngBounds()
        vertices.forEach(v => routeBounds.extend(v))

        // Find the center of the bounding box of the path
        const routeBoundsCenter = routeBounds.getCenter()

        // Starting from the center define grid lines outwards vertically until they
        //  extend beyond the edge of the bounding box by more than one cell
        this._latGrid.push(routeBoundsCenter.lat)

        // Add lines from the center out to the north
        this._latGrid.push(routeBoundsCenter.rhumbDestinationLatLng(0, range).lat)
        for (let i = 2; this._latGrid[i - 2] < routeBounds.ne.lat; i++) {
            this._latGrid.push(routeBoundsCenter.rhumbDestinationLatLng(0, range * i).lat)
        }

        // Add lines from the center out to the south
        for (let i = 1; this._latGrid[1] > routeBounds.sw.lat; i++) {
            this._latGrid.unshift(routeBoundsCenter.rhumbDestinationLatLng(180, range * i).lat)
        }

        // Starting from the center define grid lines outwards horizontally until they
        //  extend beyond the edge of the bounding box by more than one cell
        this._lonGrid.push(routeBoundsCenter.lon)

        // Add lines from the center out to the east
        this._lonGrid.push(routeBoundsCenter.rhumbDestinationLatLng(90, range).lon)
        for (let i = 2; this._lonGrid[i - 2] < routeBounds.ne.lon; i++) {
            this._lonGrid.push(routeBoundsCenter.rhumbDestinationLatLng(90, range * i).lon)
        }

        // Add lines from the center out to the west
        for (let i = 1; this._lonGrid[1] > routeBounds.sw.lon; i++) {
            this._lonGrid.unshift(routeBoundsCenter.rhumbDestinationLatLng(270, range * i).lon)
        }

        // Create a two dimensional array representing this grid
        this._grid = new Array(this._lonGrid.length)
        for (let i = 0; i < this._grid.length; i++) {
            this._grid[i] = new Array(this._latGrid.length)
        }
    }

    /**
     * Find all of the cells in the overlaid grid that the path intersects
     *
     * @param {Array<LatLng>} vertices The vertices of the path
     */
    findIntersectingCells(vertices: Array<LatLng>): void {
        // Find the cell where the path begins
        let hintXY = this.getCellCoords(vertices[0])

        // Mark that cell and it's neighbours for inclusion in the boxes
        this.markCell(hintXY)

        // Work through each vertex on the path identifying which grid cell it is in
        for (let i = 1; i < vertices.length; i++) {
            // Use the known cell of the previous vertex to help find the cell of this vertex
            let gridXY = this.getGridCoordsFromHint(vertices[i], vertices[i - 1], hintXY)
            if (gridXY[0] === hintXY[0] && gridXY[1] === hintXY[1]) {
                // This vertex is in the same cell as the previous vertex
                // The cell will already have been marked for inclusion in the boxes
                continue
            } else if ((Math.abs(hintXY[0] - gridXY[0]) === 1 && hintXY[1] === gridXY[1]) || (hintXY[0] === gridXY[0] && Math.abs(hintXY[1] - gridXY[1]) === 1)) {
                // This vertex is in a cell that shares an edge with the previous cell
                // Mark this cell and it's neighbours for inclusion in the boxes
                this.markCell(gridXY)
            } else {
                // This vertex is in a cell that does not share an edge with the previous
                //  cell. This means that the path passes through other cells between
                //  this vertex and the previous vertex, and we must determine which cells
                //  it passes through
                this.getGridIntersects(vertices[i - 1], vertices[i], hintXY, gridXY)
            }

            // Use this cell to find and compare with the next one
            hintXY = gridXY
        }
    }

    /**
     * Create two sets of bounding boxes, both of which cover all of the cells that
     *   have been marked for inclusion.
     *
     * The first set is created by combining adjacent cells in the same column into
     *   a set of vertical rectangular boxes, and then combining boxes of the same
     *   height that are adjacent horizontally.
     *
     * The second set is created by combining adjacent cells in the same row into
     *   a set of horizontal rectangular boxes, and then combining boxes of the same
     *   width that are adjacent vertically.
     *
     */
    mergeIntersectingCells(): void {
        let x: number, y: number, box: LatLngBounds

        // The box we are currently expanding with new cells
        let currentBox = null

        // Traverse the grid a row at a time
        for (y = 0; y < this._grid[0].length; y++) {
            for (x = 0; x < this._grid.length; x++) {
                if (this._grid[x][y]) {
                    // This cell is marked for inclusion. If the previous cell in this
                    //   row was also marked for inclusion, merge this cell into it's box.
                    // Otherwise start a new box.
                    box = this.getCellBounds([ x, y ])

                    if (currentBox) {
                        currentBox.extend(box.ne)
                    } else {
                        currentBox = box
                    }
                } else {
                    // This cell is not marked for inclusion. If the previous cell was
                    //  marked for inclusion, merge it's box with a box that spans the same
                    //  columns from the row below if possible.
                    this.mergeBoxesY(currentBox)
                    currentBox = null
                }
            }
            // If the last cell was marked for inclusion, merge it's box with a matching
            //  box from the row below if possible.
            this.mergeBoxesY(currentBox)
            currentBox = null
        }

        // Traverse the grid a column at a time
        for (x = 0; x < this._grid.length; x++) {
            for (y = 0; y < this._grid[0].length; y++) {
                if (this._grid[x][y]) {
                    // This cell is marked for inclusion. If the previous cell in this
                    //   column was also marked for inclusion, merge this cell into it's box.
                    // Otherwise start a new box.
                    if (currentBox) {
                        box = this.getCellBounds([ x, y ])
                        currentBox.extend(box.ne)
                    } else {
                        currentBox = this.getCellBounds([ x, y ])
                    }
                } else {
                    // This cell is not marked for inclusion. If the previous cell was
                    //  marked for inclusion, merge it's box with a box that spans the same
                    //  rows from the column to the left if possible.
                    this.mergeBoxesX(currentBox)
                    currentBox = null
                }
            }

            // If the last cell was marked for inclusion, merge it's box with a matching
            //  box from the column to the left if possible.
            this.mergeBoxesX(currentBox)
            currentBox = null
        }
    }

    /**
     * Find the cell a path vertex is in by brute force iteration over the grid
     *
     * @param {LatLng} latlon The latlon of the vertex
     *
     * @return {Array<number>} The cell coordinates of this vertex in the grid
     */
    getCellCoords(latlon: LatLng): Array<number> {
        let cx: number, cy: number

        for (let x = 0; this._lonGrid[x] < latlon.lon; x++) {
            cx = x
        }
        for (let y = 0; this._latGrid[y] < latlon.lat; y++) {
            cy = y
        }

        return [ cx, cy ]
    }

    /**
     * Find the cell a path vertex is in based on the known location of a nearby
     *  vertex. This saves searching the whole grid when working through vertices
     *  on the polyline that are likely to be in close proximity to each other.
     *
     * @param {LatLng} latlon The latlon of the vertex to locate in the grid
     * @param {LatLng} hintlatlon The latlon of the vertex with a known location
     * @param {number} hint The cell containing the vertex with a known location
     *
     * @return {Array<number>} The cell coordinates of the vertex to locate in the grid
     */
    getGridCoordsFromHint(latlon: LatLng, hintlatlon: LatLng, hint: Array<number>): Array<number> {
        let x: number, y: number

        if (latlon.lon > hintlatlon.lon) {
            for (x = hint[0]; this._lonGrid[x + 1] < latlon.lon; x++) {

            }
        } else {
            for (x = hint[0]; this._lonGrid[x] > latlon.lon; x--) {
            }
        }
        if (latlon.lat > hintlatlon.lat) {
            for (y = hint[1]; this._latGrid[y + 1] < latlon.lat; y++) {
            }
        } else {
            for (y = hint[1]; this._latGrid[y] > latlon.lat; y--) {
            }
        }

        return [ x, y ]
    }

    /**
     * Identify the grid squares that a path segment between two vertices
     * intersects with by:
     * 1. Finding the bearing between the start and end of the segment
     * 2. Using the delta between the lat of the start and the lat of each
     *    latGrid boundary to find the distance to each latGrid boundary
     * 3. Finding the lon of the intersection of the line with each latGrid
     *     boundary using the distance to the intersection and bearing of the line
     * 4. Determining the x-coord on the grid of the LatLng of intersection
     * 5. Filling in all squares between the x-coord of the previous intersection
     *     (or start) and the current one (or end) at the current y coordinate,
     *     which is known for the grid line being intersected
     *
     * @param {LatLng} start The latlon of the vertex at the start of the segment
     * @param {LatLng} end The latlon of the vertex at the end of the segment
     * @param {Array<number>} startXY The cell containing the start vertex
     * @param {Array<number>} endXY The cell containing the vend vertex
     */
    getGridIntersects(start: LatLng, end: LatLng, startXY: Array<number>, endXY: Array<number>): void {
        let edgeLatLng: LatLng, edgeXY: Array<number>, i: number
        let brng: number = start.rhumbBearingTo(end) // Step 1.
        let hint: LatLng = start
        let hintXY: Array<number> = startXY

        // Handle a line segment that travels south first
        if (end.lat > start.lat) {
            // Iterate over the east to west grid lines between the start and end cells
            for (i = startXY[1] + 1; i <= endXY[1]; i++) {
                // Find the latlon of the LatLng where the path segment intersects with
                //  this grid line (Step 2 & 3)
                edgeLatLng = this.getGridIntersect(start, brng, this._latGrid[i])

                // Find the cell containing this intersect LatLng (Step 4)
                edgeXY = this.getGridCoordsFromHint(edgeLatLng, hint, hintXY)

                // Mark every cell the path has crossed between this grid and the start,
                //   or the previous east to west grid line it crossed (Step 5)
                this.fillInGridSquares(hintXY[0], edgeXY[0], i - 1)

                // Use the LatLng where it crossed this grid line as the reference for the
                //  next iteration
                hint = edgeLatLng
                hintXY = edgeXY
            }

            // Mark every cell the path has crossed between the last east to west grid
            //  line it crossed and the end (Step 5)
            this.fillInGridSquares(hintXY[0], endXY[0], i - 1)
        } else {
            // Iterate over the east to west grid lines between the start and end cells
            for (i = startXY[1]; i > endXY[1]; i--) {
                // Find the latlon of the LatLng where the path segment intersects with
                //  this grid line (Step 2 & 3)
                edgeLatLng = this.getGridIntersect(start, brng, this._latGrid[i])

                // Find the cell containing this intersect LatLng (Step 4)
                edgeXY = this.getGridCoordsFromHint(edgeLatLng, hint, hintXY)

                // Mark every cell the path has crossed between this grid and the start,
                //   or the previous east to west grid line it crossed (Step 5)
                this.fillInGridSquares(hintXY[0], edgeXY[0], i)

                // Use the LatLng where it crossed this grid line as the reference for the
                //  next iteration
                hint = edgeLatLng
                hintXY = edgeXY
            }

            // Mark every cell the path has crossed between the last east to west grid
            //  line it crossed and the end (Step 5)
            this.fillInGridSquares(hintXY[0], endXY[0], i)
        }
    }

    /**
     * Find the latlon at which a path segment intersects with a given
     *   line of latitude
     *
     * @param {LatLng} start The vertex at the start of the path segment
     * @param {number} brng The bearing of the line from start to end
     * @param {number} gridLineLat The latitude of the grid line being intersected
     *
     * @return {LatLng} The latlon of the LatLng where the path segment intersects the grid line
     */
    getGridIntersect(start: LatLng, brng: number, gridLineLat: number): LatLng {
        let d = EARTH_RADIUS * ((toRad(gridLineLat) - toRad(start.lat)) / Math.cos(toRad(brng)))

        return start.rhumbDestinationLatLng(brng, d)
    }

    /**
     * Mark all cells in a given row of the grid that lie between two columns
     *   for inclusion in the boxes
     *
     * @param {number} startx The first column to include
     * @param {number} endx The last column to include
     * @param {number} y The row of the cells to include
     */
    fillInGridSquares(startx: number, endx: number, y: number): void {
        let x: number

        if (startx < endx) {
            for (x = startx; x <= endx; x++) {
                this.markCell([ x, y ])
            }
        } else {
            for (x = startx; x >= endx; x--) {
                this.markCell([ x, y ])
            }
        }
    }

    /**
     * Mark a cell and the 8 immediate neighbours for inclusion in the boxes
     *
     * @param {Array<number>} square The cell to mark
     */
    markCell(cell: Array<number>): void {
        let x = cell[0]
        let y = cell[1]

        this._grid[x - 1][y - 1] = 1
        this._grid[x][y - 1] = 1
        this._grid[x + 1][y - 1] = 1
        this._grid[x - 1][y] = 1
        this._grid[x][y] = 1
        this._grid[x + 1][y] = 1
        this._grid[x - 1][y + 1] = 1
        this._grid[x][y + 1] = 1
        this._grid[x + 1][y + 1] = 1
    }

    /**
     * Search for an existing box in an adjacent row to the given box that spans the
     * same set of columns and if one is found merge the given box into it. If one
     * is not found, append this box to the list of existing boxes.
     *
     * @param {LatLngBounds} box The box to merge
     */
    mergeBoxesX(box: LatLngBounds): void {
        if (null == box) {
            return
        }

        for (var i = 0; i < this._boxesX.length; i++) {
            if (
                this._boxesX[i].ne.lon === box.sw.lon
                && this._boxesX[i].sw.lat === box.sw.lat
                && this._boxesX[i].ne.lat === box.ne.lat
            ) {
                this._boxesX[i].extend(box.ne)

                return
            }
        }

        this._boxesX.push(box)
    }

    /**
     * Search for an existing box in an adjacent column to the given box that spans
     * the same set of rows and if one is found merge the given box into it. If one
     * is not found, append this box to the list of existing boxes.
     *
     * @param {LatLngBounds}  The box to merge
     */
    mergeBoxesY(box: LatLngBounds): void {
        if (null === box) {
            return
        }

        for (let i = 0; i < this._boxesY.length; i++) {
            if (
                this._boxesY[i].ne.lat === box.sw.lat
                && this._boxesY[i].sw.lon === box.sw.lon
                && this._boxesY[i].ne.lon === box.ne.lon
            ) {
                this._boxesY[i].extend(box.ne)

                return
            }
        }

        this._boxesY.push(box)
    }

    /**
     * Obtain the LatLng of the origin of a cell on the grid
     *
     * @param {Array<number>} cell The cell to lookup.
     *
     * @return {LatLngBounds} The latlon of the origin of the cell.
     */
    getCellBounds(cell: Array<number>): LatLngBounds {
        const
            north = this._latGrid[cell[1] + 1],
            west = this._lonGrid[cell[0]],
            south = this._latGrid[cell[1]],
            east = this._lonGrid[cell[0] + 1]

        const
            ne = new LatLng(north, east),
            nw = new LatLng(north, west),
            sw = new LatLng(south, west),
            se = new LatLng(south, east)

        return new LatLngBounds(ne, nw, sw, se)
    }
}
