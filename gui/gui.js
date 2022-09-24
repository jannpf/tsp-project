import Parameters from "../data_models/Parameters.js";
import Point from "../data_models/Point.js";
import Route from "../data_models/Route.js";
import { optimize } from "../algorithm/simAnnealing.js";
import { start } from "../processControl/controlElements.js";
import { pause } from "../processControl/controlElements.js";
import { resume } from "../processControl/controlElements.js";
import { stop } from "../processControl/controlElements.js";

/**
 * 
 * Setup of the Leaflet map and needed gloabl variables
 * 
 */



//layer openstreetmap
var osm = L.tileLayer('https://tile.openstreetmap.de/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap',
});

//layer white background
var white = (L.tileLayer('https://tile.openstreetmap.de/{z}/{x}/{y}.png', {
    maxZoom: 19,
    opacity: 0,
}));

//define layergrup of baseMaps
var baseMaps = {
    "Weißer Hintergrund": white,
    "Weltkarte": osm,

};

//define map and starting positiob
var leaflet_map = L.map('leaflet-map', {
    center: [47.807027, 9.584041],
    zoom: 12,
    layers: [white, osm]
});

//layer-control to decide between base-maps
var layerControl = L.control.layers(baseMaps).addTo(leaflet_map);

var customControl = L.Control.extend({
    options: {
        position: 'topleft'
    },

    onAdd: function (leaflet_map) {
        var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');

        container.style.backgroundColor = 'white';
        container.style.backgroundImage = "url(http://t1.gstatic.com/images?q=tbn:ANd9GcR6FCUMW5bPn8C4PbKak2BJQQsmC-K9-mbYBeFZm1ZM2w2GRy40Ew)";
        container.style.backgroundSize = "30px 30px";
        container.style.width = '30px';
        container.style.height = '30px';

        container.onclick = function () {
            clear_map(true, true);

            parameters.points.forEach(e => {
                parameters.removePoint(e)
            });
        }

        return container;
    }
});

leaflet_map.addControl(new customControl());
// Script for adding marker on map click
leaflet_map.on('click', on_map_click);

//needed gloabl variables
var polyline = L.Layer;
var markers = new Array;
const parameters = new Parameters();
var export_route = "";


/**
 * Initiates slider and import-modal
 */
window.addEventListener('load', () => {
    change_slider();

    return window.import_modal = document.getElementById("import-modal");
})

/**
 * Syncs Slider Text and Bar
 * @param {String} fixed fixed="text" sets the text field as source
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

    sessionStorage.setItem('frequency', sliderValue.value);

    console.log(parameters.frequency);
}

/**
 * Clears the map of markers and routes if set to true
 * @param {Boolean} d_marker 
 * @param {Boolean} d_route 
 */
window.clear_map = function clear_map(d_marker, d_route) {

    //checks if any markers are active and function input is set, if so delets them
    if (markers.length !== 0 && d_marker) {
        markers.forEach(e => {
            leaflet_map.removeLayer(e);
        });
    }
    //checks if any route is active and function input is set, if so delets it
    if (leaflet_map.hasLayer(polyline) && d_route) {
        leaflet_map.removeLayer(polyline)
    };
}

/**
 * Draws a custom marker with the given lat,long, id onto the map.
 * @param {Number} x latitude
 * @param {Number} y Longitude
 * @param {Number} id id
 */
function draw_point(x, y, id) {

    //defines custom icon for point containing id as html element
    var pin_icon = L.divIcon({
        className: "number-icon",
        iconUrl: "../assets/Pin.svg",
        iconSize: [24, 29],
        iconAnchor: [12, 29],
        popupAnchor: [0, -29],
        html: id,
    });

    //sets attributes of the geoJson with lat,long and id
    var geojsonFeature = {
        "type": "Feature",
        "id": id,
        "geometry": {
            "type": "Point",
            "coordinates": [x, y]
        }
    }

    //creates a marker containing the geoJson Data with the correct icon
    L.geoJson(geojsonFeature, {

        pointToLayer: function (feature, latlng) {

            //set attributes of the marker
            var marker = new L.marker([x, y], {
                icon: pin_icon,
                title: id,
                riseOnHover: true,
                draggable: false,
            })

            //definies popup assosiated with marker (includes lat, long, deletebutton)
            marker.bindPopup(`<div class="popup">
            <span class="popup-text">Lat: ${Math.round((x + Number.EPSILON) * 1000) / 1000}</span>
            <span class="popup-text">Lon: ${Math.round((y + Number.EPSILON) * 1000) / 1000}</span>
            <input type='button' value='Pin ${id} löschen' class='marker-delete-button'/></div>`);

            //function called when poup is opened
            marker.on("popupopen", on_popup_open);

            //adds marker to markers array to reference for clearing map
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

    //check for correct type
    if (!typeof (param) == Parameters) {
        throw new Error(`Invalid Argument: Expected type 'Paramters' but got '${typeof (param)}'`);
    }

    //clears map
    clear_map(true, true);

    //draw each point contained in parameters
    param.points.forEach(p => {
        draw_point(p.x, p.y, p.id);
    });
}

/**
 * Draws the connecting lines of a route onto the map.
 * Outputs current length and temperature to GUI.
 * @param {Route} r Route
 * @param {Number} t temperature
 */
export function draw_route(r, t) {

    //check for correct type
    if (!typeof (r) == Route) {
        throw new Error(`Invalid Argument: Expected type 'Route' but got '${typeof (r)}'`);
    }

    //clears map of routes
    clear_map(false, true);

    //converts the point coordinates into a 2-dimensional array for polyline
    var result = Array();
    r.points.forEach(e => {
        result.push([e.x, e.y]);
    });
    result.push([r.points[0].x, r.points[0].y])

    //draws route onto map via. polyline
    polyline = L.polyline(result, { color: "#676767" }).addTo(leaflet_map);

    //GUI: ouput length and temperature
    window.document.getElementById("length-text").innerText = Math.round((r.getLength() + Number.EPSILON) * 100) / 100 + " km";
    window.document.getElementById("temperature-text").innerText = Math.round((t + Number.EPSILON) * 100) / 100;
}

/**
 * Adds a point to the map location, saves point in parameters, redraws map.
 * @param {Event} e map location
 */
function on_map_click(e) {

    //prevents addpoint if the modal is open, closes it instead
    if (import_modal.style.display == "none") {

        //initiates last_id
        var last_id = 0;

        //gets the id of the last point in the parameters
        if (parameters.points.length !== 0) {
            last_id = parameters.points[parameters.points.length - 1].id
        }

        //adds the click-location as a new point to the parameters
        parameters.addPoint(new Point(last_id + 1, e.latlng.lat, e.latlng.lng));

        //clears map of route
        clear_map(false, true);

        //redraws all points saved in parameters
        draw_parameters_points(parameters);
    } else {
        //close modal
        close_import();
    }
}
/**
 * Called upon user opening a popup, provides option to delete the point
 */
function on_popup_open() {

    //sets the currently open marker
    var tempMarker = this;

    // To remove the point on click of the delete button in the popup of the point
    document.querySelector(".marker-delete-button").onclick = function () {

        //find the point based on the id value
        var index_delete = parameters.points.findIndex(p => {
            return p.id === tempMarker.feature.id
        })

        //clears map of route
        clear_map(false, true);

        //remove point from parameters and map
        parameters.removePoint(index_delete);
        leaflet_map.removeLayer(tempMarker);
    };
}

/**
 * Shows the import-modal when the import-button is pressed
 * @param {Event} ev mouseclick
 */
window.import_file = function import_file(ev) {

    import_modal.style.display = "flex";
}

/**
 * closes the import-modal when called (press of X or press outside of modal)
 * @param {Event} ev mouseclick
 */
window.close_import = function close_import(ev) {

    import_modal.style.display = "none";
}


/**
 * Handles a file being dropped on the import-modal, calls redfile()
 * Prevents the browser from opening the file
 * @param {Event} ev drop on modal
 */
window.dropHandler = function dropHandler(ev) {

    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();

    const file = ev.dataTransfer.files[0];

    //wraps the readfile() call in a try-catch to prevent incorrect file-upload
    try {
        readfile(file);
    } catch (error) {

        //GUI: Informs user about error in file
        window.document.getElementById("import-placeholder").textContent = "Bitte nochmals versuchen!";
        window.document.getElementById("import-tooltip").textContent = error;
    }
}
/**
 * Handles a file being dragged over the modal
 * Prevents the browser from opening the file
 * @param {Event} ev dragOver modal
 */
window.dragOverHandler = function dragOverHandler(ev) {
    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();
}

/**
 * redirects click on the import-modal to hidden file-input to select .csv files
 * @param {Event} ev mouseclick
 */
window.select_file = function select_file(ev) {

    window.document.getElementById("file").click();
}

/**
 * opens the systems file exporer to select file, calls readfile()
 * @param {Event} ev mouseclick
 */
window.open_file = function open_file(ev) {

    const file = ev.target.files[0];

    //wraps the readfile() call in a try-catch to prevent incorrect file-upload
    try {
        readfile(file);
    } catch (error) {

        //GUI: Informs user about error in file
        window.document.getElementById("import-placeholder").textContent = "Bitte nochmals versuchen!";
        window.document.getElementById("import-tooltip").textContent = error;
    }
}

/**
 * Trys to import the points and distancematrix of a file into the parameters.
 * Deletes exsting points in parameters.
 * Returns info about the status of the import to the user via. GUI
 * @param {File} file 
 * @throws {Invalid File} File does not match necessary requirements
 */
function readfile(file) {


    //confirms that the file is a csv file, @throws {Invalid File} Error otherwise
    if (file.type == "text/csv") {

        //resets parameter points to correctly save the imported
        parameters.points.forEach(e => {
            parameters.removePoint(e)
        });

        //initiates new FileReader
        let reader = new FileReader();
        reader.readAsBinaryString(file);

        //imports points in try-catch-block to catch errors thrown by .importPoints()
        reader.onload = function (e) {
            try {
                parameters.importPoints(e.target.result);

                //GUI: informs user about the correctly uploaded file
                window.document.getElementById("import-modal-upload").style.display = "flex";
                window.document.getElementById("import-placeholder").textContent = "Super!";
                window.document.getElementById("import-tooltip").textContent = `Datei: '${file.name}'`;

            } catch (error) {

                //GUI: Informs user about error in file
                window.document.getElementById("import-placeholder").style.display = "flex";
                window.document.getElementById("import-placeholder").textContent = "Bitte nochmals versuchen!";
                window.document.getElementById("import-tooltip").textContent = error;
            }
        }
    } else {
        //throw  @throws {Invalid File}
        throw new Error(`Invalid File: Expected File of Type '.csv' but got '${file.type}'`);
    }
}


/**
 * Button to upload import is shown if file was valid. 
 * Emptys the map and displays imported points from import
 * @param {Event} event mouseclick
 */
window.import_to_route = function import_to_route(event) {

    //delete existing markers from map
    if (markers.length !== 0) {
        markers.forEach(e => {
            leaflet_map.removeLayer(e);
        });
    }
    //delete existing route from map
    if (leaflet_map.hasLayer(polyline)) { leaflet_map.removeLayer(polyline) };

    //close modal and reset it
    import_modal.style.display = "none";
    window.document.getElementById("import-modal-upload").style.display = "none";
    window.document.getElementById("import-placeholder").style.display = "flex";
    window.document.getElementById("import-placeholder").textContent = "Datei hier hinziehen oder klicken.";
    window.document.getElementById("import-tooltip").textContent = "Unterstütze Formate: .csv";

    //draw imported points onto map from parameters
    draw_parameters_points(parameters);
}


/**
 * Starts algorithm
 */
window.start_algorithm = async function start_algorithm() {

    //initiate algorithm
    sessionStorage.setItem('algorithm_status', "running");
    optimize(parameters);

    //update bottom button section
    window.document.getElementById("start-start").style.display = "none";
    window.document.getElementById("stop-pause").style.display = "flex";
    window.document.getElementById("export-start").style.display = "none";
}

/**
 * Pauses algorithm
 */
window.pause_algorithm = function pause_algorithm() {

    //sets processControl to pause algorithm
    sessionStorage.setItem('algorithm_status', "pause");


    //update bottom button section
    window.document.getElementById("stop-pause").style.display = "none";
    window.document.getElementById("stop-resume").style.display = "flex";
    window.document.getElementById("export-start").style.display = "none";
    //return new Promise(resolve =>  btn.onclick = () => resolve());
}

/**
 * Resumes algorithm
 */
window.resume_algorithm = function resume_algorithm() {

    //sets processControl to resume algroithm
    sessionStorage.setItem('algorithm_status', "running");

    //update bottom button section
    window.document.getElementById("stop-pause").style.display = "flex";
    window.document.getElementById("stop-resume").style.display = "none";
    window.document.getElementById("export-start").style.display = "none";
}

/**
 * Stops algorithm
 */
window.stop_algorithm = function stop_algorithm() {

    //sets processControl to stop algorithm
    sessionStorage.setItem('algorithm_status', "stop");
}

/**
 * provides a function for the algorithm to call upon completion.
 * Takes the final route as an input and shows the export button.
 * @param {Route} r 
 */
export function finish_algorithm(r) {

    //defines the final route to prepare for export
    export_route = new Route(r.points, r.distanceMatrix);

    //update bottom button section
    window.document.getElementById("stop-pause").style.display = "none";
    window.document.getElementById("stop-resume").style.display = "none";
    window.document.getElementById("export-start").style.display = "flex";
}

/**
 * Exports the final route to a .gpx file
 */
window.export_solution = function export_solution() {

    //create .gpx file with export_route as content
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/json;charset=utf-8,' + export_route.export_to_gpx());
    element.setAttribute('download', "export_route.gpx");

    //hides the element
    element.style.display = 'none';
    document.body.appendChild(element);

    //simulates a click on the element and then delets it
    element.click();
    document.body.removeChild(element);
}
