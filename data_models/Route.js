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
}
