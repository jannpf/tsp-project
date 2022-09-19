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
     * @returns {Map} The resulting distance matrix
     */
    determineDistanceMatrix() {
        this.#distanceMatrix = new Map();
        for (const start of this.#points) {
            let distances = new Map();
            for (const end of this.#points) {
                // add distance to the point
                distances.set(end.id, start.getDistance(end));
            }
            this.#distanceMatrix.set(start.id, distances);
        }
        return this.#distanceMatrix;
    }

    //Frequency
    get frequency() {
        return this.#frequency;
    }

    set frequency(value) {
        if (value < 0 || value > 10)
            throw new Error(`Invalid Argument: Frequency must be between 0 and 10`);

        this.#frequency = value;
    }

    //Points
    get points() {
        return this.#points;
    }

    /**
     * Adds a new Point
     * @param {Point} p
     * @returns {Array} The updated array of points
     */
    addPoint(p) {
        if (!typeof (p) == Point)
            throw new Error(`Invalid Argument: Expected type 'Point' but got '${typeof (p)}'`);

        this.#points.push(p);
        return this.#points
    }

    /**
     * Removes Point at index
     * @param {Number} index
     * @returns {Array} The updated array of points
     */
    removePoint(index) {
        if (!typeof (index) === Number || index >= this.#points.length)
            throw new Error(`Invalid Argument: Index '${index}' out of range`);
        this.#points.splice(index, 1)
        return this.#points
    }

    /**
     * Imports points from the csv file contents
     * Parses the distance matrix if available
     * @param {String} fileContents 
     * @returns {Array} The new array of points
     */
    importPoints(fileContents) {
        let csvData = [];
        // remove first row, as its assumed to be the header
        let lines = fileContents.split("\n").slice(1);

        lines.forEach(res => {
            let fields = res.split(";");
            // ignore blank lines
            if (fields.length > 1)
                csvData.push(fields);
        });

        if (csvData.length < 1)
            throw new Error("Given file does not contain any points!");

        // counter for id generation
        let id = 0;

        // clear current points
        this.#points = new Array();

        // create points from the first two columns
        csvData.forEach(line => {
            if (line[0] && line[1]) {
                this.#points.push(new Point(id, line[0], line[1]));
                id++;
            }
        })

        // check if a distance matrix is included in the file 
        let contains_dm = csvData.every(line => line.length == (this.#points.length + 2))

        // if yes, parse the distance matrix
        if (contains_dm) {
            // clear current distance matrix
            this.#distanceMatrix = new Map();

            // construct new distance matrix line by line
            csvData.forEach((line, lineIndex) => {
                let distances = new Map();
                line.slice(2).forEach((x, i) => distances.set(i, x));
                this.#distanceMatrix.set(lineIndex, distances);
            })
        }
        return this.#points;
    }
}
