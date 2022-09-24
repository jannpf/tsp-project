import Route from "../data_models/Route.js";
import {draw_route} from "../gui/gui.js";
import {finish_algorithm} from "../gui/gui.js";

 


function sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}


function resume() {
    return new Promise(function (resolve, reject) {
        document.getElementById('resume').addEventListener('click', function () {
            resolve();
        });
    });
}



export async function optimize(parameters) {

    if (parameters.distanceMatrix.size !== parameters.points.length) {
        var startingRoute = new Route(parameters.points, parameters.determineDistanceMatrix());
    } else {
        var startingRoute = new Route(parameters.points, parameters.distanceMatrix)
    }

    var temperature = parameters.points.length*10;
    var start_temperature = structuredClone(temperature);
    var coolingFactor = 0.995;
    var currentRoute = startingRoute.duplicate();
    var iterations = 0;

    while(temperature > 0) {

    draw_route(currentRoute, temperature);

        if(sessionStorage.getItem('algorithm_status') == 'running') {

            var indexOfPointA = 0;
            var indexOfPointB = 0;

            while(indexOfPointA == indexOfPointB) {
                indexOfPointA = Math.floor(Math.random()*parameters.points.length);
                indexOfPointB = Math.floor(Math.random()*parameters.points.length);
            }

            var newRoute = currentRoute.duplicate();
            newRoute.swapPoints(indexOfPointA, indexOfPointB);

            if(newRoute.getLength() < currentRoute.getLength()) {
                currentRoute = newRoute;
                iterations = 0;
            } else {
                var difference = ((currentRoute.getLength() - newRoute.getLength())/(parameters.averageDistance))**2;
                var probabilityFactor = Math.exp(-1*difference / temperature);
                console.log('Differenz:' + difference);
                console.log('Temperatur:' + temperature);
                console.log('Faktor:' + probabilityFactor);


                if(probabilityFactor > Math.random()) {
                    currentRoute = newRoute;
                    iterations = 0;
                } else {
                    iterations++;
                    console.log(iterations);
                }
            }

            temperature = temperature * coolingFactor;


            draw_route(currentRoute, temperature);
            await sleep(100-sessionStorage.getItem('frequency'));

            if (iterations > parameters.points.length**2) {
                break;
            }

        } else if (sessionStorage.getItem('algorithm_status') == 'stop') {
            finish_algorithm(currentRoute)
            break;
        } else {
            console.log("Waiting for resume")
            await resume();
            console.log("Done waiting")
        }
    }
    
    
    finish_algorithm(currentRoute);
}
