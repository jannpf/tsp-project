import Route from "../data_models/Route.js";
import {draw_route} from "../gui/gui.js";


    
    // temperature = 1000;
    // coolingFactor = 0.995;


    function sleep(milliseconds) {
        return new Promise(resolve => setTimeout(resolve, milliseconds))
    }

    export async function optimize(startingRoute, points) {
        var temperature = 100000;
        var coolingFactor = 0.995;
        var currentRoute = startingRoute.duplicate();

        while(temperature > 0.005) {
            //if(processControl.status == "running") {
                var indexOfPointA = 0;
                var indexOfPointB = 0;
                
                while(indexOfPointA == indexOfPointB) {
                    indexOfPointA = Math.floor(Math.random()*points.length);
                    indexOfPointB = Math.floor(Math.random()*points.length);
                }

                var newRoute = currentRoute.duplicate();

                newRoute.swapPoints(indexOfPointA, indexOfPointB);
                console.log('\n' + 'Current Route: ' + currentRoute.getLength());
                console.log('\n' + 'Neue Route: ' + newRoute.getLength());
                if(newRoute.getLength() < currentRoute.getLength()) {
                    currentRoute = newRoute;
                } else {
                    var difference = currentRoute.getLength() - newRoute.getLength();
                    var probabilityFactor = Math.exp(difference / temperature);

                    if(probabilityFactor > Math.random()) {
                        currentRoute = newRoute;
                    }
                }

                temperature = temperature * coolingFactor;

                await sleep(2000);

                draw_route(currentRoute);
            //} else {
              //  break;
            //}
        }
    }
