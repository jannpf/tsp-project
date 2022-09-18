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
}
