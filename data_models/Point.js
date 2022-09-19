export default class Point {
    #id = 0;
    #x = 0;
    #y = 0;

    /**
     * Creates a new Point Object
     * @param {Number} x 
     * @param {Number} y 
     */
    constructor(id, x, y) {
        this.#id = id;
        this.#x = x;
        this.#y = y;
    }

    get x() {
        return this.#x;
    }

    get y() {
        return this.#y;
    }

    get id() {
        return this.#id;
    }

    /**
     * Returns the euclidean distance to the given point
     * @param {Point} p 
     */
    getDistance(p) {
        let x_dist = this.#x - p.x;
        let y_dist = this.#y - p.y;
        return Math.sqrt(x_dist ** 2 + y_dist ** 2);
    }
}
