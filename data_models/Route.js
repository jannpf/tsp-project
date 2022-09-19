import Point from "./Point.js";

export default class Route {
    #points = [];
    #distanceMatrix = new Map();

    /**
     * Creates a new Route Object
     * @param {Array} points 
     * @param {Array} distanceMatrix
     * 
     */
    constructor(points, distanceMatrix) {
        if (!typeof (points) === Array || points.lenth <= 0) //|| !points.every(x => typeof (x) === Point))
            throw new Error(`Invalid Argument: Expected list of points`);
        if (!typeof (distanceMatrix) === Array || distanceMatrix.length <= 0) // || !distanceMatrix.every(x => typeof (x) === Number))
            throw new Error(`Invalid Argument: Expected non-empty list of floats for distance matrix`);

        this.#points = points;
        this.#distanceMatrix = distanceMatrix;
    }

    get points() {
        return this.#points;
    }

    /**
     * Calculate total length of route based on the distance matrix
     */
    getLength() {
        let length = 0
        for (let i = 1; i < this.#points.length; i++) {
            let p1 = this.#points[i - 1];
            let p2 = this.#points[i];
            length += this.#distanceMatrix.get(p1.id).get(p2.id);
        }
        return length;
    }

    /**
     * Swap points at i1 and i2
     * @param {Number} i1 Index 1
     * @param {Number} i2 Index 2
     * @returns {Array} The updated array of points
     */
    swapPoints(i1, i2) {
        var temp = this.#points[i1];
        this.#points[i1] = this.#points[i2];
        this.#points[i2] = temp;
        return this.#points;
    }

    /**
     * Converts the Route into a gpx format
     * 
     * @returns {String} The route in gpx format
     */
    export_to_gpx() {
        let xml_tag = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>`
        let gpx_start = `
        <gpx xmlns="http://www.topografix.com/GPX/1/1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd" version="1.1" creator="TSP">
        <metadata>
        <time>${new Date().toISOString()}</time>
        </metadata>
        <trk>
        <name>Travelling Salesman Route</name>
        <desc>Total distance: ${this.getLength()}km</desc>`

        let segment = "<trkseg>";
        this.#points.forEach(p => {
            segment += `<trkpt lat="${p.x}" lon="${p.y}"></trkpt>`
        })
        segment += '</trkseg>'
        let gpx_end = '</trk></gpx>';

        let result = xml_tag + gpx_start + segment + gpx_end;

        return result.replace(/\\"/g, '"');
    }
}
