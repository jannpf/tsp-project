import Parameters from "../data_models/Parameters.js";
import Point from "../data_models/Point.js";

window.addEventListener('load', () => {
    initiate();
})

window.addEventListener('resize', () => {
    initiate_canvas();
})

const parameters = new Parameters();

window.initiate = function initiate() {
    initiate_canvas();
    change_slider();
}

window.change_slider = function change_slider(fixed) {

    const mySlider = document.getElementById("my-slider");
    const sliderValue = document.getElementById("slider-value");

    if (fixed == "text") {
        sliderValue.value > 100 ? sliderValue.value = mySlider.value = 100 : (sliderValue.value < 0 ? sliderValue.value = mySlider.value = 0 : mySlider.value = sliderValue.value);
    } else {
        sliderValue.value = mySlider.value;
    }
}


function initiate_canvas() {

    window.canvas = document.getElementById("canvas");
    if (canvas.getContext) {
        window.ctx = canvas.getContext("2d");

        canvas.width = window.innerWidth * 0.96;
        canvas.height = window.innerHeight * 0.6;

        return ctx;
    }
}





function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top,
    };
}



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

function get_distance_two_points(a, b) {
    if (!typeof (a) == !typeof (b) == Point)
        throw new Error(`Invalid Argument: Expected type 'Point' but got '${typeof (p)}'`);

    return Math.hypot(a.x - b.x, a.y - b.y);
}



window.start_algorithm = function start_algorithm() {
    alert("started")
}
