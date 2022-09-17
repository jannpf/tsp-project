class Parameters {
    #points = [];
    #distanceMatrix = [];
    #frequency = 0;

    constructor() { }

    //Distance Matrix
    get distanceMatrix() {
        return this.#distanceMatrix;
    }

    importDistanceMatrix() {
        throw new Error("Not Implemented");
    }

    determineDistanceMatrix() {
        throw new Error("Not Implemented");
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
        if (!typeof (index) != Number || index >= this.#points.length())
            throw new Error(`Invalid Argument: Index '${index}' out of range`);
        this.#points = this.#points.splice(index, 1)
    }
}
