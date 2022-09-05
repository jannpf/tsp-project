class Parameters {
    #points = [];
    #distanceMatrix = [];
    #frequency = 0;

    constructor() { }

    importDistanceMatrix() {
        throw new Error("Not Implemented");
    }

    determineDistanceMatrix() {
        throw new Error("Not Implemented");
    }

    get distanceMatrix() {
        return this.#distanceMatrix;
    }

    get frequency() {
        return this.#frequency;
    }

    set frequency(value) {
        if (value < 0)
            throw new Error(`Invalid Argument: Frequency must be > 0`);

        this.#frequency = value;
    }

    get points() {
        return this.#points;
    }

    addPoint(p) {
        if (!typeof (p) == Point)
            throw new Error(`Invalid Argument: Expected type 'Point' but got '${typeof (p)}'`);

        this.#points.push(p);
        //this.determineDistanceMatrix();
    }
}
