import Point from "./Point.js";

export default class Parameters {
    #points = new Array();
    #distanceMatrix = new Map();
    #frequency = 0;
    #distanceMatrixImported = false;

    constructor() { }

    //Distance Matrix
    get distanceMatrix() {
        return this.#distanceMatrix;
    }

    /**
     * Calculate the distance matrix by determining the euclidean distance for each point combination
     * @returns {Map} The resulting distance matrix
     */
    determineDistanceMatrix() {
        if (this.#distanceMatrixImported) {
            return this.#distanceMatrix;
        }

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
        if (value < 0 || value > 100)
            throw new Error(`Invalid Argument: Frequency must be between 0 and 100`);

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

        // clear current distance matrix to avoid having old data
        this.#distanceMatrix = new Map();
        this.#distanceMatrixImported = false

        // create points from the first two columns
        csvData.forEach(line => {
            let x = parseFloat(line[0])
            let y = parseFloat(line[1])
            if (isNaN(x) || isNaN(y)) {
                this.#points = new Array();
                throw new Error("Unable to parse coordinates: not a number");
            }
            this.#points.push(new Point(id, x, y));
            id++;
        })

        // import distance matrix, if included in the file 
        if (csvData.every(line => line.length == (this.#points.length + 2))) {
            this.importDistanceMatrix(csvData)
        }
        return this.#points;
    }

    /**
     * Imports the distance matrix from the given
     * @param {Array} csvData 
     */
    importDistanceMatrix(csvData) {
        // construct new distance matrix line by line
        csvData.forEach((line, lineIndex) => {
            let distances = new Map();
            // parse distances for this starting point
            line.slice(2).forEach((x, i) => {
                let distance = parseFloat(x);
                // throw error if distance matrix contains non-numeric types
                if (isNaN(distance)) {
                    // revert changes
                    this.#distanceMatrix = new Map();
                    this.#distanceMatrixImported = false;
                    throw new Error("Unable to parse distance matrix: not a number");
                }
                distances.set(i, distance)
            });
            this.#distanceMatrix.set(lineIndex, distances);
        })
    }
}
