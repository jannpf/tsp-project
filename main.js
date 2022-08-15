var canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight*0.9;
var ctx = canvas.getContext("2d");
ctx.fillStyle = "rgba(0, 0, 0, 0)";
ctx.clearRect(0, 0, canvas.width, canvas.height);

//draw circiles at PosXY + Add Number Next to it
function drawCircle(posX, posY, i) {
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(posX, posY, 10, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(posX, posY, 7, 0, 2 * Math.PI);
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.fillStyle = "grey";
    ctx.font = "20px Segoe UI";
    ctx.fillText(i + 1, posX + 12, posY + 7);  
}

function drawCities(cities) {
    ctx.fillStyle = "rgba(0, 0, 0, 0)";
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (var i = 0; i < cities.length; i++) {
        drawCircle(cities[i][0], cities[i][1], i);
    }
}
//draw cities and routes
function connectCities(cities, roundtrip) {
    ctx.strokeStyle = "red";
    ctx.lineWidth = 3;

    for (var i = 0; i < cities.length - 1; i++) {
        ctx.beginPath();
        ctx.moveTo(cities[i][0], cities[i][1]);
        ctx.lineTo(cities[i + 1][0], cities[i + 1][1]);
        ctx.stroke();
    }
    if (roundtrip == true) {
        ctx.beginPath();
        ctx.moveTo(cities[cities.length - 1][0], cities[cities.length - 1][1]);
        ctx.lineTo(cities[0][0], cities[0][1]);
        ctx.stroke();
    }
}

//generate cities
function getRandomCities(countCities) {
    var cities = [];

    for (var i = 0; i < countCities; i++) {
        cities[i] = new Array(2);
            cities[i][1] = Math.floor(Math.random() * (window.innerHeight*0.9-40)+20);
            cities[i][0] = Math.floor(Math.random() * (window.innerWidth-60)+20);
    }
    return cities;
}

function getTotalDistance(cities) {
    var totalDist = 0;
    for (var i = 0; i < cities.length - 1; i++) {
        var dist = getDistanceAB(cities[i], cities[i + 1]);
        totalDist += dist;
    }
    totalDist += getDistanceAB(cities[0], cities[cities.length - 1]);
    return totalDist;
}

function swap(a, b, arr) {
    [arr[a], arr[b]] = [arr[b], arr[a]];
    return arr;
}

function findNeighbor(city, citiesFree) {
    var bestDist = 10000;
    var bestNeighbor = 0;

    for (var i = 0; i < citiesFree.length; i++) {
        dist = getDistanceAB(city, citiesFree[i]);
        if (dist < bestDist) {
            bestDist = dist;
            bestNeighbor = i;
        }
    }
    return bestNeighbor;
}

function getDistanceAB(a, b) {
    return Math.hypot(a[0] - b[0], a[1] - b[1]);
}

async function optimize(citiesFree) {
    const element = document.getElementById("id01");
    const element2 = document.getElementById("id02");

    citiesUsed = [];
    citiesUsed[0] = citiesFree[0];
    citiesFree.splice(0, 1);

    while (citiesFree.length > 0) {
        connectCities(citiesUsed, false);

        tempNeighbor = findNeighbor(citiesUsed[citiesUsed.length - 1], citiesFree);

        citiesUsed.push(citiesFree[tempNeighbor]);
        citiesFree.splice(tempNeighbor, 1);

        await new Promise((r) => setTimeout(r, 1000 / countCities));
    }
    drawCities(citiesUsed);
    connectCities(citiesUsed, true);
    var startDist = getTotalDistance(citiesUsed);
    element.innerHTML = "Länge: " + startDist;
    console.log("Initial Length: " + startDist);

    var t = countCities*10;
    citiesToTest = [];
    bestCities = cities = JSON.parse(JSON.stringify(citiesUsed));
    var exp = 0;
    var finalDist = startDist;

    var c = 0;

    while (t > 0) {

        if(c == 1000){break};

        element2.innerHTML = "Temp: " + t.toFixed(2);

        i = Math.floor(Math.random() * countCities);

        if (Math.random < 0.5) {
            if (i == 0) {j = countCities - 1;} 
            else {j = i - 1;}
        } else {
            if (i == countCities -1) {j = 0;}
            else {j = i + 1;}
        }

        citiesToTest = swap(i, j, citiesUsed);

        if (getTotalDistance(citiesToTest) < startDist) {
            connectCities(citiesToTest);
            startDist = getTotalDistance(citiesToTest);

            if (startDist <= finalDist) {
                bestCities = JSON.parse(JSON.stringify(citiesToTest));
                finalDist = startDist;
                console.log(finalDist);
                t = 0.995 * t;
                c = 0;
                
            }

            element.innerHTML = "Länge: " + startDist.toFixed(2);

            drawCities(citiesToTest);
            connectCities(citiesToTest, true);

            await new Promise((r) => setTimeout(r, 250 / countCities));
        } else {
            var exp = Math.exp(-1*(getTotalDistance(citiesToTest) - startDist) / t);
            
            //&& (getTotalDistance(citiesToTest) - startDist) < t

            if (exp > Math.random()) {
                connectCities(citiesToTest);
                startDist = getTotalDistance(citiesToTest);
                element.innerHTML = "Länge: " + startDist.toFixed(2);

                drawCities(citiesToTest);
                connectCities(citiesToTest, true);
                t = 0.995 * t;
                c = 0;
                await new Promise((r) => setTimeout(r, 250 / countCities));
            } else {
                citiesUsed = swap(j, i, citiesToTest);
            }
        }
       c++; 
    }

    console.log("done, waiting 500ms");
    await new Promise((r) => setTimeout(r, 500));

    drawCities(bestCities);
    connectCities(bestCities);
    element.innerHTML = "Finale Länge: " + finalDist.toFixed(2);

    return bestCities;
}

var countCities = 9;
originCities = getRandomCities(countCities);
cities = JSON.parse(JSON.stringify(originCities));
drawCities(cities, true);

async function buttonRun() {
    cities = JSON.parse(JSON.stringify(originCities));
    drawCities(cities);
    optimize(cities);
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top,
    };
}

function placeCityOnCursor(evt) {
    var pos = getMousePos(canvas, evt);

    newCity = [];
    newCity[0] = pos.x;
    newCity[1] = pos.y;
    var checkCounter = 0;

    console.log(newCity);

    for (let i = 0; i < originCities.length; i++) {
        if (getDistanceAB(newCity, originCities[i]) < 20) {
            originCities.splice(i, 1);
            countCities--;
            checkCounter = -500;
        } else {
            checkCounter++;
        }
    }

    if (checkCounter >= countCities) {
        drawCircle(newCity[0], newCity[1], countCities + 1);
        originCities.push(newCity);
        countCities++;
    }
    drawCities(originCities);
}
