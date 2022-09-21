import Parameters from "../data_models/Parameters.js";
import Point from "../data_models/Point.js";
import Route from "../data_models/Route.js";

/**
 * Initiates JS-controlled Elements on window-load
 */
window.addEventListener('load', () => {
    initiate_canvas();
    change_slider();

    return window.import_modal = document.getElementById("import-modal");
})

/**
 * Re-Scales the Canvas on window resize
 */
window.addEventListener('resize', () => {
    initiate_canvas();
})

window.addEventListener('mouseup', function (event) {
    if (!import_modal.contains(event.target)) {
        import_modal.style.display = 'none';
    }
});


const parameters = new Parameters();

/**
 * Scales the Canvas to correct size
 * @returns {Context2D} canvas interaction object
 */
function initiate_canvas() {

    window.canvas = document.getElementById("canvas");
    if (canvas.getContext) {
        window.ctx = canvas.getContext("2d");

        canvas.width = window.innerWidth * 0.96;
        canvas.height = window.innerHeight * 0.6;

        return ctx;
    }
}
/**
 * Syncs Slider Text and Bar two
 * @param {String} fixed fixed="text" sets the text as truth
 */
window.change_slider = function change_slider(fixed) {

    const mySlider = document.getElementById("my-slider");
    const sliderValue = document.getElementById("slider-value");

    if (fixed == "text") {
        sliderValue.value > 100 ? sliderValue.value = mySlider.value = 100 : (sliderValue.value < 0 ? sliderValue.value = mySlider.value = 0 : mySlider.value = sliderValue.value);
    } else {
        sliderValue.value = mySlider.value;
    }

    parameters.frequency = sliderValue.value;
}

/**
 * gets current location of the mouse on the canvas
 * @param {Canvas} canvas the main canvas
 * @param {onmousedown} evt the mouse position
 * @returns {Object} x, y
 */
function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top,
    };
}

/**
 * Draws a point p onto the canvas with the p.id as a label
 * @param {Point} p 
 */
window.draw_point = function draw_point(p) {
    if (!typeof (p) == Point)
        throw new Error(`Invalid Argument: Expected type 'Point' but got '${typeof (p)}'`);
    //marker with number inside
    ctx.fillStyle = "#263238"
    let pin = new Path2D('M5 0h20c2.76 0 5 2.22 5 4.97v19.86c0 2.74-2.24 4.96-5 4.96h-5.63L15 36l-4.38-6.2H5c-2.76 0-5-2.23-5-4.97V4.97C0 2.22 2.24 0 5 0Z');
    ctx.setTransform(1, 0, 0, 1, p.x - 15, p.y - 35);
    ctx.fill(pin);

    ctx.fillStyle = "#FFFFFF"
    ctx.font = '20px poppins';
    ctx.fillText(p.id, 3, 21);
    ctx.resetTransform();
}
/**
 * Draws all Points stored in a Parameters onto the canvas
 * @param {Parameters} param 
 */
function draw_parameters_points(param) {
    if (!typeof (param) == Parameters) {
        throw new Error(`Invalid Argument: Expected type 'Paramters' but got '${typeof (param)}'`);
    }
    ctx.resetTransform();
    ctx.fillStyle = "#FFFFFF";
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    param.points.forEach(p => {
        draw_point(p);
    });
}

/**
 * Draws a Route w/ Connections and Points onto the main Canvas
 * @param {Route} r 
 */
function draw_route(r) {

    if (!typeof (r) == Route) {
        throw new Error(`Invalid Argument: Expected type 'Route' but got '${typeof (r)}'`);
    }

    //clear and reset Canvas
    ctx.resetTransform();
    ctx.fillStyle = "#FFFFFF";
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "grey";
    ctx.lineWidth = 2;

    //connect all points in order
    for (let i = 0; i < r.points.length - 1; i++) {

        ctx.beginPath();
        ctx.moveTo(r.points[i].x, r.points[i].y);
        ctx.lineTo(r.points[i + 1].x, r.points[i + 1].y);
        ctx.stroke();
    }
    //connect last point to first
    ctx.beginPath();
    ctx.moveTo(r.points[r.points.length - 1].x, r.points[r.points.length - 1].y);
    ctx.lineTo(r.points[0].x, r.points[0].y);
    ctx.stroke();


    //draw Pins for the Points with ID
    r.points.forEach(p => {
        draw_point(p);
    });

    //ouput lenght and temperature to gui
    var length = Math.round((r.getLength()/1000 + Number.EPSILON) * 100) / 100

    window.document.getElementById("length-text").innerText = length;
    window.document.getElementById("temperature-text").innerText = "0";
}

/**
 * Adds a new Point at the location of the cursor.
 * Existing Points at the location are deleted
 * manages Points in Parameters
 * @param {onmousedown} evt the mouse lovation
 */

window.click_canvas = function click_canvas(evt) {

    var loc = getMousePos(canvas, evt);
    var temp = new Point(parameters.points.length, loc.x, loc.y);
    var delete_counter = 0;
    var last_id = 0;

    if (parameters.points.length !== 0) {
        last_id = parameters.points[parameters.points.length - 1].id
    }

    parameters.points.forEach(point => {
        //if (get_distance_two_points(point, temp) < 40) {

        if (temp.getEuclideanDistance(point) < 20 ){

            var index_delete = parameters.points.findIndex(p => {
                return p.id === point.id
            })


            parameters.removePoint(index_delete);
            delete_counter++;
        }
    });

    if (delete_counter == 0) {
        parameters.addPoint(new Point(last_id + 1, temp.x, temp.y));
    }
    draw_parameters_points(parameters);
}

/**
 * Starts Algorithm
 */
window.start_algorithm = function start_algorithm() {

    var route = new Route(parameters.points, parameters.determineDistanceMatrix());
    draw_route(route);
}

window.import_file = function import_file(evt) {

    import_modal.style.display = "flex";
}
window.close_import = function close_import(evt) {

    window.close_modal = document.getElementsByClassName("close-modal");
    import_modal.style.display = "none";
}

window.dropHandler = function dropHandler(ev) {

    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();

    const file = ev.dataTransfer.files[0];
    if (file.type == "text/csv") {

        readfile(file);

    } else {
        window.document.getElementById("import-tooltip").textContent = "Die Datei scheint keine .csv zu sein. Versuchen Sie es erneut!";
        throw new Error(`Invalid File: Expected File of Type '.csv' but got '${file.type}'`);
    }


}

window.dragOverHandler = function dragOverHandler(ev) {
    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();
}

window.select_file = function select_file(ev) {

    window.document.getElementById("file").click();

}
window.open_file = function open_file(ev) {

    const file = ev.target.files[0];
    if (file.type == "text/csv") {

        readfile(file);
    } else {
        window.document.getElementById("import-tooltip").textContent = "Die Datei scheint keine .csv zu sein. Versuchen Sie es erneut!";
        throw new Error(`Invalid File: Expected File of Type '.csv' but got '${file.type}'`);
    }
}


function readfile(file) {

    //reset parameter points
    parameters.points.forEach(e => {
        parameters.removePoint(e)
    });

    let reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = function (e) {
        try {
            parameters.importPoints(e.target.result);

            window.document.getElementById("import-modal-upload").style.display = "flex";
            window.document.getElementById("import-placeholder").textContent = "Super!";
            window.document.getElementById("import-tooltip").textContent = `Datei: '${file.name}'`;


        } catch (error) {
            window.document.getElementById("import-placeholder").style.display = "flex";
            window.document.getElementById("import-placeholder").textContent = "Bitte nochmals versuchen!";
            window.document.getElementById("import-tooltip").textContent = error;
        }

        console.log(parameters.points);
    }

}

window.import_to_route = function import_to_route(event) {

    if (parameters.distanceMatrix.size === 0) {
        var route = new Route(parameters.points, parameters.determineDistanceMatrix());
    } else {
        var route = new Route(parameters.points, parameters.distanceMatrix)
    }

    //close modal and reset it
    import_modal.style.display = "none";

    window.document.getElementById("import-modal-upload").style.display = "none";
    window.document.getElementById("import-placeholder").style.display = "flex";
    window.document.getElementById("import-placeholder").textContent = "Datei hier hinziehen oder klicken.";
    window.document.getElementById("import-tooltip").textContent = "Unterstütze Formate: .csv";

    draw_route(route);

}