class Point {
    x = 0;
    y = 0;

    /**
     * 
     * @param {Number} x 
     * @param {Number} y 
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    get x() {
        return this.x;
    }

    get y() {
        return this.x;
    }

    set x(value) {
        if (!typeof (value) === Number)
            throw new Error(`Invalid Argument: Expected numerical value for Coordinate`);

        this.x = value;
    }

    set y(value) {
        if (!typeof (value) === Number)
            throw new Error(`Invalid Argument: Expected numerical value for Coordinate`);

        this.y = value;
    }
}
