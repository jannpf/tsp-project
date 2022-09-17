import Point from "./Point.js";

export default class Parameters {
    #points = new Array();
    #distanceMatrix = new Map();
    #frequency = 0;

    constructor() { }

    //Distance Matrix
    get distanceMatrix() {
        return this.#distanceMatrix;
    }

    importDistanceMatrix() {
        throw new Error("Not Implemented");
    }

    /**
     * Calculate the distance matrix by determining the euclidean distance for each point combination
     */
    determineDistanceMatrix() {
        this.#distanceMatrix = new Map();
        for(const start of this.#points) {
            debugger;
            let distances = new Map();
            for(const end of this.#points) {
                // determine euclidean distance for current pair of points
                let x_dist = start.x - end.x;
                let y_dist = start.y - end.y;
                let distance = Math.sqrt(x_dist ** 2 + y_dist ** 2);

                // add distance to the point
                distances.set(end.id, distance);
            }
            this.#distanceMatrix.set(start.id, distances);
        }
    }

    //Frequency
    get frequency() {
        return this.#frequency;
    }

    set frequency(value) {
        if (value < 0)
            throw new Error(`Invalid Argument: Frequency must be > 0`);

        this.#frequency = value;
    }

    //Points
    get points() {
        return this.#points;
    }

    /**
     * 
     * @param {Point} p
     */
    addPoint(p) {
        if (!typeof (p) == Point)
            throw new Error(`Invalid Argument: Expected type 'Point' but got '${typeof (p)}'`);

        this.#points.push(p);
        return this.#points
        //this.determineDistanceMatrix();
    }

    /**
     * 
     * @param {Number} index
     */
    removePoint(index) {
        if (!typeof (index) === Number || index >= this.#points.length)
            throw new Error(`Invalid Argument: Index '${index}' out of range`);
        this.#points.splice(index, 1)
        return this.#points
    }
}
