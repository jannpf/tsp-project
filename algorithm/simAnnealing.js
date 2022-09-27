import Route from "../data_models/Route.js";
import { draw_route, finish_algorithm } from "../gui/gui.js";

/**
 * waits for the time given
 * @param {Number} milliseconds waiting in milliseconds
 * @returns {Promise} returns resolved promise
 */
function sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

/**
 * Waits for the button resume to be pressed
 * @returns {Promise} returns resolved promise
 */
function resume() {
    return new Promise(function (resolve, reject) {
        // waiting for the element with the id = resume to be clicked
        document.getElementById('stop-resume').addEventListener('click', function () {
            resolve();
        });
    });
}


/**
 * optimizes the starting Route
 * @param {Parameter} parameters object with informations about points, distances
 */
export async function optimize(parameters) {

    // check if a correct distance matrix exists
    if (parameters.distanceMatrix.size !== parameters.points.length) {
        // no correct distance matrix, then create a new route instance with the given points and determine the distances
        var startingRoute = new Route(parameters.points, parameters.determineDistanceMatrix());
    } else {
        // correct distance matrix, then crate new route instance with the given points and given distance matrix
        var startingRoute = new Route(parameters.points, parameters.distanceMatrix)
    }

    // setting up the start parameters for the algorithm

    // create a temperature that is depends linearly on the number of points
    var temperature = parameters.points.length * 10;
    var coolingFactor = 0.995;

    // set the starting route instance to the current instance
    var currentRoute = startingRoute.duplicate();

    // create a counter for iterations without an optimization
    var iterations = 0;

    // create a while-loop with an abort-condition wich depends exponentially on the number of points
    while (iterations < parameters.points.length ** 2) {

        // draw the current route and update the temperature
        draw_route(currentRoute, temperature);

        // check if the status of the algorithm is running
        if (sessionStorage.getItem('algorithm_status') == 'running') {

            // create temporary variables to swap to points
            var indexOfPointA = 0;
            var indexOfPointB = 0;

            // loop until to variables have different values
            while (indexOfPointA == indexOfPointB) {

                // get to random integer numbers between zero and the total of the points
                indexOfPointA = Math.floor(Math.random() * parameters.points.length);
                indexOfPointB = Math.floor(Math.random() * parameters.points.length);

            }

            // duplicate the current route
            var newRoute = currentRoute.duplicate();
            // change the two points with the indices created above to get a slightly different route 
            newRoute.swapPoints(indexOfPointA, indexOfPointB);

            // check if new route is shorter then the current route
            if (newRoute.getLength() < currentRoute.getLength()) {

                // accept new route as current route
                currentRoute = newRoute;
                // clear the number of iterations without change
                iterations = 0;

            } else {

                // calculate the difference of the two routes in relation to the average distance between points
                // mulitply by it self (empirically) 
                var difference = ((currentRoute.getLength() - newRoute.getLength()) / (parameters.averageDistance)) ** 2;
                // calculate a factor between 0 and 1 depending on the relative distance and the temperature
                var probabilityFactor = Math.exp(-1 * difference / temperature);

                // randomize if worse route will be accepted (probability depends on the calculated factor)
                if (probabilityFactor > Math.random()) {

                    // accept new route as current route
                    currentRoute = newRoute;
                    // clear the number of iterations without change
                    iterations = 0;

                } else {

                    // increase the number of iterations without change
                    iterations++;

                }
            }

            // decrease the temperature by the cooling factor
            temperature = temperature * coolingFactor;
            // wait to slowdown the algorithm
            // time waiting depends on the frequency 
            await sleep(100 - sessionStorage.getItem('frequency'));

            // (if the status of the algorithm is not running)
            // check if the status of the algorithm is stop
        } else if (sessionStorage.getItem('algorithm_status') == 'stop') {

            // give back the current Route to the gui
            finish_algorithm(currentRoute);

            // stop the loop
            break;

        } else { // status has to be equals resume

            // wait for resume 
            await resume();

        }
    }


    finish_algorithm(currentRoute);
}
