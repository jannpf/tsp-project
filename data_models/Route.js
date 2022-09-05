class Route {
    #temperature = 0;
    #points = points;

    /**
     * 
     * @param {Array} points 
     */
    constructor(points) {
        if (!typeof (points) === Array || points.lenth <= 0 || !points.every(x => typeof (x) === Point))
            throw new Error(`Invalid Argument: Expected list of points`);

        this.#points = points;
    }

    get points() {
        return this.#points;
    }

    get temperature() {
        return this.#temperature;
    }

    set temperature(value) {
        if (value < 0)
            throw new Error(`Invalid Argument: Temperature must be > 0`);

        this.#temperature = value;
    }
}
