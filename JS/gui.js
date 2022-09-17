
//gets called once body is fully loaded
function initiate(){
    initiate_canvas();
    change_slider();
}

//matches the slider with the text input
function change_slider(fixed){

const mySlider = document.getElementById("my-slider");
const sliderValue = document.getElementById("slider-value");

    if (fixed == "text") {
        if(sliderValue.value > 100){
            sliderValue.value = 100;
            alert("Maximale Frequenz ist 100!")
        }
        mySlider.value = sliderValue.value
    } else {
        sliderValue.value = mySlider.value;
    }

    valPercent = (mySlider.value / mySlider.max)*100;
    mySlider.style.background = 'linear-gradient(to right, #3264fe ${valPercent}%, #d5d5d5 ${valPercent}%)';
}


function initiate_canvas(){

    canvas = document.getElementById("canvas");
    if (canvas.getContext) {
        ctx = canvas.getContext("2d");

        canvas.width = window.innerWidth*0.96;
        canvas.height = window.innerHeight*0.6;

        return ctx;
      }
    }


window.addEventListener('resize', () => {
    initiate_canvas();
  })

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top,
    };
}


function draw_point(evt, Point) {

    if (evt !== 0) {
        var Point = getMousePos(canvas, evt);
        Point.number = 12;
    }

    //marker with number inside
    ctx.fillStyle = "#263238"
    let p = new Path2D('M5 0h20c2.76 0 5 2.22 5 4.97v19.86c0 2.74-2.24 4.96-5 4.96h-5.63L15 36l-4.38-6.2H5c-2.76 0-5-2.23-5-4.97V4.97C0 2.22 2.24 0 5 0Z');
    ctx.setTransform(1, 0, 0, 1, Point.x, Point.y);
    ctx.fill(p);

    ctx.fillStyle = "#FFFFFF"
    ctx.font = '20px poppins';
    ctx.fillText(Point.number, 6, 21);

}

function start_algorithm() {
    alert("started")
}
