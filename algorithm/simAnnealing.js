import Route from "../data_models/Route";

class SimulatedAnnealing {
    
    #temperature = 1000;
    #coolingFactor = 0.995;

    sleep(milliseconds) {
        return new Promise(resolve => setTimeout(resolve, milliseconds))
    }

    async optimize(startingRoute) {

        currentRoute = startingRoute;

        while(this.#temperatur > 1) {
            if(processControl.status == "running") {
                indexOfPointA = 0;
                indexOfPointB = 0;
                
                while(indexOfPointA == indexOfPointB) {
                    indexOfPointA = Math.floor(Math.random()*currentRoute.getPoints().length);
                    indexOfPointB = Math.floor(Math.random()*currentRoute.getPoints().length);
                }

                newRoute = currentRoute;

                newRoute.swapPoints(indexOfPointA, indexOfPointB);
                
                if(newRoute.length() < currentRoute.length()) {
                    currentRoute = newRoute;
                } else {
                    difference = newRoute.length() - currentRoute.getPoints().length;
                    probabilityFactor = Math.exp(difference / temperature);

                    if(probabilityFactor < Math.random()) {
                        currentRoute = newRoute;
                    }
                }

                this.#temperature = this.#temperature * this.#coolingFactor;

                await this.sleep(Parameters.frequency());

                gui.drawRoute(currentRoute);
            } else {
                break;
            }
        }
    }
}