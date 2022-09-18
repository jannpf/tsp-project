import Parameters from "../data_models/Parameters.js";
import Point from "../data_models/Point.js";

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



/**
 * Handles Modal closing
 */
document.addEventListener('click', function handleClickOutsideModal(event) {
    window.import_tab = document.getElementById("import-tab");
    if (!import_modal.contains(event.target) && !import_tab.contains(event.target)) {
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
    console.log(canvas.width + " " + canvas.height)

    param.points.forEach(p => {
        draw_point(p);
    });
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
        if (get_distance_two_points(point, temp) < 40) {

            var index_delete = parameters.points.findIndex(p => {
                return p.id === point.id
            })
            console.log(index_delete);

            parameters.removePoint(index_delete);
            delete_counter++;
        }
    });

    if (delete_counter == 0) {
        parameters.addPoint(new Point(last_id + 1, temp.x, temp.y));
    }
    draw_parameters_points(parameters);
    console.log(parameters.points)
}
/**
 * Calculates the distance between two Points
 * @param {Point} a 
 * @param {Point} b 
 * @returns {Number} Distance in Pixel
 */
function get_distance_two_points(a, b) {
    if (!typeof (a) == !typeof (b) == Point)
        throw new Error(`Invalid Argument: Expected type 'Point' but got '${typeof (p)}'`);

    return Math.hypot(a.x - b.x, a.y - b.y);
}

/**
 * Starts Algorithm
 */
window.start_algorithm = function start_algorithm() {
    alert("started")
}

function initiate_modals() {
    // Get the modal



}

window.import_file = function import_file(evt) {

    import_modal.style.display = "flex";
}
window.close_import = function close_import(evt) {

    window.close_modal = document.getElementsByClassName("close-modal");
    import_modal.style.display = "none";
}