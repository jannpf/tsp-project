class Route {
    #points = [];
    #distanceMatrix = new Map();

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
        this.#distanceMatrix = distanceMatrix;
    }

    get points() {
        return this.#points;
    }

    /**
     * Calculate total length of route based on the distance matrix
     */
    getLength() {
        length = 0
        for (let i = 1; i < this.#points.length(); i++) {
            p1 = this.#points[i-1];
            p2 = this.#points[i];
            length += this.#distanceMatrix.get(p1.id).get(p2.id);
        }
        return length;
    }

    swapPoints(i1, i2) {
        var temp = this.#points[i1];
        this.#points[i1] = this.#points[i2];
        this.#points[i2] = temp;
        return this.#points;
    }
}
