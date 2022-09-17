class Route {
    #temperature = 0;
    #points = [];
    #distanceMatrix = [];

    /**
     * 
     * @param {Array} points 
     * @param {Array} distanceMatrix
     */
    constructor(points, distanceMatrix) {
        if (!typeof (points) === Array || points.lenth <= 0 || !points.every(x => typeof (x) === Point))
            throw new Error(`Invalid Argument: Expected list of points`);
        if (!typeof (distanceMatrix) === Array || distanceMatrix.lenth <= 0 || !distanceMatrix.every(x => typeof (x) === Number))
            throw new Error(`Invalid Argument: Expected non-empty list of floats for distance matrix`);
        this.#points = points;
        this.#distanceMatrix = distanceMatrix
    }

    get points() {
        return this.#points;
    }

    get length() {
        throw new Error("Not Implemented");
    }

    swapPoints(i1, i2) {
        var temp = this.#points[i1];
        this.#points[i1] = this.#points[i2];
        this.#points[i2] = temp;
        return this.#points
    }
}
