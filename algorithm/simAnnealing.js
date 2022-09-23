import Route from "../data_models/Route.js";
import {draw_route} from "../gui/gui.js";
import {finish_algorithm} from "../gui/gui.js";
import {get_status } from "../processControl/controlElements.js";
 


    
    // temperature = 1000;
    // coolingFactor = 0.995;


    function sleep(milliseconds) {
        return new Promise(resolve => setTimeout(resolve, milliseconds))
    }

    export async function optimize(startingRoute, points, frequency) {
        var temperature = 100;
        var coolingFactor = 0.995;
        var currentRoute = startingRoute.duplicate();


        while(temperature > 0.1) {

            await sleep(1);

            if(get_status() == 'running') {
            //    var indexOfPointA = Math.floor(Math.random()*points.length);
                var indexOfPointA = 0;
                var indexOfPointB = 0;
                // if (Math.random < 0.5) {
                //     if (indexOfPointA == 0) {indexOfPointB = points.length - 1;} 
                //     else {indexOfPointB = indexOfPointA - 1;}
                // } else {
                //     if (indexOfPointA == points.length -1) {indexOfPointB = 0;}
                //     else {indexOfPointB = indexOfPointA + 1;}
                // }
                
                while(indexOfPointA == indexOfPointB) {
                    indexOfPointA = Math.floor(Math.random()*points.length);
                    indexOfPointB = Math.floor(Math.random()*points.length);
                    // console.log('A: ' + indexOfPointA);
                    // console.log('B: ' + indexOfPointB);
                }

                var newRoute = currentRoute.duplicate();

                newRoute.swapPoints(indexOfPointA, indexOfPointB);
                // console.log('\n' + 'Current Route: ' + currentRoute.getLength());
                // console.log('\n' + 'Neue Route: ' + newRoute.getLength());
                // console.log('\n' + 'Angenommen:');
                if(newRoute.getLength() < currentRoute.getLength()) {
                    currentRoute = newRoute;
                    // console.log('Ja, weil kürzer');
                } else {
                    var difference = (currentRoute.getLength() - newRoute.getLength())/currentRoute.getLength()*100;
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


                draw_route(currentRoute);
                await sleep(frequency);

            } else if (get_status() == 'stopped') {
               break;
            }
            
        }
        if (get_status() !== 'stopped'){finish_algorithm(currentRoute);}
    
    }
