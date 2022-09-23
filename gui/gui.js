import Parameters from "../data_models/Parameters.js";
import Point from "../data_models/Point.js";
import Route from "../data_models/Route.js";
import { optimize } from "../algorithm/simAnnealing.js";
import { start } from "../processControl/controlElements.js";
import { pause } from "../processControl/controlElements.js";
import { resume } from "../processControl/controlElements.js";
import { stop } from "../processControl/controlElements.js";




var leaflet_map = L.map('leaflet-map').setView([47.807027, 9.584041], 12);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(leaflet_map);

var polyline = L.Layer;
var markers = new Array;



/**
 * Initiates JS-controlled Elements on window-load
 */
window.addEventListener('load', () => {
    //initiate_canvas();
    change_slider();

    return window.import_modal = document.getElementById("import-modal");
})

/**
 * Re-Scales the Canvas on window resize
 */
window.addEventListener('resize', () => {
    //initiate_canvas();
})

window.addEventListener('mouseup', function (event) {
    if (!import_modal.contains(event.target)) {
        import_modal.style.display = 'none';
    }
});


const parameters = new Parameters();
var export_route = ""


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
    console.log(parameters.frequency);
}


function draw_point(x, y, id) {

    var pin_icon = L.divIcon({
        className: "number-icon",
        iconUrl: "../assets/Pin.svg",
        iconSize: [24, 29],
        iconAnchor: [12, 29],
        popupAnchor: [0, -29],
        html: id,
    });


    var geojsonFeature = {

        "type": "Feature",
        "id": id,
        "geometry": {
            "type": "Point",
            "coordinates": [x, y]
        }
    }

    L.geoJson(geojsonFeature, {

        pointToLayer: function (feature, latlng) {

            var marker = new L.marker([x, y], {
                icon: pin_icon,
                title: id,
                alt: "Resource Location",
                riseOnHover: true,
                draggable: false,

            }).bindPopup(`<div class="popup">
            <span class="popup-text">Lat: ${Math.round((x + Number.EPSILON) * 1000) / 1000}</span>
            <span class="popup-text">Lon: ${Math.round((y + Number.EPSILON) * 1000) / 1000}</span>
            <input type='button' value='Pin ${id} löschen' class='marker-delete-button'/></div>`);

            marker.on("popupopen", onPopupOpen);
            markers.push(marker);
            return marker;
        }
    }).addTo(leaflet_map);
};

/**
 * Draws all Points stored in a Parameters onto the canvas
 * @param {Parameters} param 
 */
function draw_parameters_points(param) {
    if (!typeof (param) == Parameters) {
        throw new Error(`Invalid Argument: Expected type 'Paramters' but got '${typeof (param)}'`);
    }

    if (markers.length !== 0) {
        markers.forEach(e => {
            leaflet_map.removeLayer(e);
        });
    }

    param.points.forEach(p => {
        draw_point(p.x, p.y, p.id);
    });


}

// Script for adding marker on map click
leaflet_map.on('click', onMapClick);

function onMapClick(e) {

    var last_id = 0;

    if (parameters.points.length !== 0) {
        last_id = parameters.points[parameters.points.length - 1].id
    }
    console.log(leaflet_map._layers)

    parameters.addPoint(new Point(last_id + 1, e.latlng.lat, e.latlng.lng));

    if (leaflet_map.hasLayer(polyline)) { leaflet_map.removeLayer(polyline) };

    draw_parameters_points(parameters);
}

function onPopupOpen() {

    var tempMarker = this;

    // To remove marker on click of delete button in the popup of marker
    document.querySelector(".marker-delete-button").onclick = function () {

        var index_delete = parameters.points.findIndex(p => {
            return p.id === tempMarker.feature.id
        })

        if (leaflet_map.hasLayer(polyline)) { leaflet_map.removeLayer(polyline) };

        parameters.removePoint(index_delete);
        leaflet_map.removeLayer(tempMarker);

    };

}


//marker.on('click', marker.remove());

/**
 * Draws a Route w/ Connections and Points onto the main Canvas
 * @param {Route} r 
 */
export function draw_route(r) {

    if (!typeof (r) == Route) {
        throw new Error(`Invalid Argument: Expected type 'Route' but got '${typeof (r)}'`);
    }

    if (leaflet_map.hasLayer(polyline)) { leaflet_map.removeLayer(polyline) };


    var result = Array();

    r.points.forEach(e => {
        result.push([e.x, e.y]);
    });

    result.push([r.points[0].x, r.points[0].y])

    polyline = L.polyline(result, { color: "#676767" }).addTo(leaflet_map);


    //ouput lenght and temperature to gui
    var length = Math.round((r.getLength() + Number.EPSILON) * 100) / 100

    window.document.getElementById("length-text").innerText = length;
    window.document.getElementById("temperature-text").innerText = "0";
}

/**
 * Adds a new Point at the location of the cursor.
 * Existing Points at the location are deleted
 * manages Points in Parameters
 * @param {onmousedown} evt the mouse lovation
 */




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

    if (markers.length !== 0) {
        markers.forEach(e => {
            leaflet_map.removeLayer(e);
        });
    }

    if (leaflet_map.hasLayer(polyline)) { leaflet_map.removeLayer(polyline) };
    //close modal and reset it
    import_modal.style.display = "none";

    window.document.getElementById("import-modal-upload").style.display = "none";
    window.document.getElementById("import-placeholder").style.display = "flex";
    window.document.getElementById("import-placeholder").textContent = "Datei hier hinziehen oder klicken.";
    window.document.getElementById("import-tooltip").textContent = "Unterstütze Formate: .csv";

    draw_parameters_points(parameters);

}


/**
 * Starts Algorithm
 */
window.start_algorithm = function start_algorithm() {


    if (parameters.distanceMatrix.size === 0) {
        var route = new Route(parameters.points, parameters.determineDistanceMatrix());
    } else {
        var route = new Route(parameters.points, parameters.distanceMatrix)
    }

    draw_route(route);

    start(route, parameters.points, parameters.frequency);

    window.document.getElementById("start-start").style.display = "none";
    window.document.getElementById("stop-pause").style.display = "flex";
    window.document.getElementById("export-start").style.display = "none";
}


window.pause_algorithm = function pause_algorithm() {

    pause();

    window.document.getElementById("stop-pause").style.display = "none";
    window.document.getElementById("stop-resume").style.display = "flex";
    window.document.getElementById("export-start").style.display = "none";

}

window.resume_algorithm = function resume_algorithm() {

    resume();

    window.document.getElementById("stop-pause").style.display = "flex";
    window.document.getElementById("stop-resume").style.display = "none";
    window.document.getElementById("export-start").style.display = "none";
}

window.stop_algorithm = function stop_algorithm() {


    if (leaflet_map.hasLayer(polyline)) { leaflet_map.removeLayer(polyline) };

    stop();

    window.document.getElementById("stop-pause").style.display = "none";
    window.document.getElementById("stop-resume").style.display = "none";
    window.document.getElementById("start-start").style.display = "flex";
    window.document.getElementById("export-start").style.display = "none";


}


export function finish_algorithm(r) {

    export_route = new Route(r.points,r.distanceMatrix);

    window.document.getElementById("stop-pause").style.display = "none";
    window.document.getElementById("stop-resume").style.display = "none";
    window.document.getElementById("export-start").style.display = "flex";


}

window.export_solution = function export_solution() {


    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/json;charset=utf-8,'+ export_route.export_to_gpx());
    element.setAttribute('download', "export_route.gpx");

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);

}
