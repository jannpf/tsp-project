import Route from "../data_models/Route.js";
import {draw_route} from "../gui/gui.js";
import {finish_algorithm} from "../gui/gui.js";
import {get_status } from "../processControl/controlElements.js";
import {stop } from "../processControl/controlElements.js";
 


    
    // temperature = 1000;
    // coolingFactor = 0.995;


    function sleep(milliseconds) {
        return new Promise(resolve => setTimeout(resolve, milliseconds))
    }

    export async function optimize(parameters) {

        if (parameters.distanceMatrix.size !== parameters.points.length) {
            var startingRoute = new Route(parameters.points, parameters.determineDistanceMatrix());
        } else {
            var startingRoute = new Route(parameters.points, parameters.distanceMatrix)
        }

        var temperature = parameters.points.length*100;
        var start_temperature = structuredClone(temperature);
        var coolingFactor = 0.995;
        var currentRoute = startingRoute.duplicate();


        while(temperature > 0.001) {

            await sleep(1);

            if(get_status() == 'running') {
  
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
                } else {
                    var difference = ((currentRoute.getLength() - newRoute.getLength())/(currentRoute.getLength() + newRoute.getLength()))*start_temperature;
                    var probabilityFactor = Math.exp(difference / temperature);
                    console.log('Differenz:' + difference);
                    console.log('Temperatur:' + temperature);
                    console.log('Faktor:' + probabilityFactor);


                    if(probabilityFactor > Math.random()) {
                        currentRoute = newRoute;
                        // console.log('Ja, weil Faktor');
                        //console.log(probabilityFactor);
                    }
                }

                temperature = temperature * coolingFactor;


                draw_route(currentRoute, temperature);
                await sleep(100-sessionStorage.getItem('frequency'));

            } else if (get_status() == 'stopped') {
               break;
            }
            
        }
        if (get_status() !== 'stopped'){
            finish_algorithm(currentRoute);
            stop();
        }
    
    }
