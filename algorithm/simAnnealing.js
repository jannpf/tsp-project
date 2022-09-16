class SimulatedAnnealing {
    
    #temperature = 1000;
    #coolingFactor = 0.995;

    optimize(startingRoute) {

        oldRoute = startingRoute;

        while(this.#temperatur > 1) {

            indexOfPointA = 0;
            indexOfPointB = 0;
            
            while(indexOfPointA == indexOfPointB) {
                indexOfPointA = Math.floor(Math.random()*oldRoute.size());
                indexOfPointB = Math.floor(Math.random()*oldRoute.size());
            }

            newRoute = oldRoute.swapTwoPoints(indexOfPointA, indexOfPointB);
            
            if(newRoute.length() < oldRoute.length()) {
                oldRoute = newRoute;
            } else {
                difference = newRoute.length() - oldRoute.length();
                probabilityFactor = Math.exp(difference / temperature);

                if(probabilityFactor < Math.random()) {
                    oldRoute = newRoute;
                }
            }

            this.#temperature = this.#temperature * this.#coolingFactor;
        }        
    }
}