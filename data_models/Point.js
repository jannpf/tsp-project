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
     * Returns the distance to the given point on the globe in km 
     * using the haversine formula
     * @param {Point} dest 
     */
     getDistance(dest) {
        let lon1 = this.#x
        let lat1 = this.#y
        let lon2 = dest.x
        let lat2 = dest.y

        // radius of the earth in km
        let r = 6371
        let p = Math.PI / 180

        // haversine formula
        let a = 0.5 - Math.cos((lat2-lat1)*p)/2 + Math.cos(lat1*p)*Math.cos(lat2*p) * (1-Math.cos((lon2-lon1)*p)) / 2
        return 2 * r * Math.asin(Math.sqrt(a))
    }

    /**
     * Returns the euclidean distance to the given point
     * @param {Point} dest 
     */
    getEuclideanDistance(dest) {
        let x_dist = this.#x - dest.x;
        let y_dist = this.#y - dest.y;
        return Math.sqrt(x_dist ** 2 + y_dist ** 2);
    }
}
