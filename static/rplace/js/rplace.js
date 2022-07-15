// Props to https://www.cs.colostate.edu/~anderson/newsite/javascript-zoom.html 
// for Canvas zooming & panning (which doesn't work without me debugging so I'll focus elsewhere for now)

const durRange = document.getElementById('durationRange');
const rInc = document.getElementById('rangeInc');
const rDec = document.getElementById('rangeDec');
const lmp = document.getElementById('lastMinPlaced');
const tp = document.getElementById('totalPlaced');
let canvas;
let ctx;
let widthCanvas;
let heightCanvas;
let selectedDuration, selectedRange;
let pause;

// View parameters
let xleftView = 0;
let ytopView = 0;
let widthViewOriginal = 1.0;        // Actual width and height of zoomed and panned display
let heightViewOriginal = 1.0;
let widthView = widthViewOriginal;
let heightView = heightViewOriginal;

window.addEventListener('load', setup, false);

function setup() {
    pause = false;
    canvas = document.getElementById('rCanvas');
    ctx = canvas.getContext('2d');

    widthCanvas = canvas.width;
    heightCanvas = canvas.height;

    // canvas.addEventListener('dblclick', handleDblClick, false);
    // canvas.addEventListener('mousedown', handleMouseDown, false);
    // canvas.addEventListener('mousemove', handleMouseMove, false);
    // canvas.addEventListener('mouseup', handleMouseUp, false);
    // canvas.addEventListener('mousewheel', handleMouseWheel, false);
    // canvas.addEventListener('DOMMouseScroll', handleMouseWheel, false);

    rInc.addEventListener("click", () => {
        durRange.value++;
        generate();
    });
    rDec.addEventListener("click", () => {
        durRange.value = 1;
        window.sessionStorage.setItem('lastMinPlaced', '0');
        window.sessionStorage.setItem('totalPlaced', '0');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        generate();
    });
    // play.addEventListener('click', () => {
    //     if (play.classList.contains('fa-play')) {
    //         pause = false;
    //         play.className = play.className.replace('fa-play', 'fa-pause');
    //         let current = window.sessionStorage.getItem('currentMinute');
    //         while (!pause) {
    //             for (let i = current + 1; i < 4321; i++) {
    //                 durRange.value = i;
    //                 generate();
    //             };
    //         }
    //     } else {
    //         pause = true;
    //         play.className = play.className.replace('fa-pause', 'fa-play');
    //     }
    // });
    document.addEventListener('keydown', (e) => {
        var code = e.keyCode;
        if (code == '37') {
            durRange.value = 1;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            generate();
        } else if (code == '39') {
            durRange.value++;
            generate();
        }

    });
    window.sessionStorage.clear();
    window.sessionStorage.setItem('lastMinute', '0');
    window.sessionStorage.setItem('currentMinute', '1');
    window.sessionStorage.setItem('lastMinPlaced', '0');
    window.sessionStorage.setItem('totalPlaced', '0');

    generate();
}




async function getRPlaceTiles(range) {
    let url = `${window.location.href}get/?`;
    if (range) {
        window.sessionStorage.setItem('lastMinute', window.sessionStorage.getItem('currentMinute'));
        window.sessionStorage.setItem('currentMinute', String(range));
        url += `r=${range}`;
    }
    document.getElementById('background').style.display = "inherit";
    await fetch(url).then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    }).then(data => {
        document.getElementById('background').style.display = "none";
        console.log(data);
        // archiveTiles(data);
        saveStats(data);
        drawTiles(data);
    }).catch(error => {
        console.error('There has been a problem with your fetch operation: ', error);
    });
}

function generate() {
    selectedRange = durRange.value;
    if (selectedRange != '') {
        setRangeOutput(selectedRange);
        // let currentImg = ctx.getImageData(0, 0, 1000, 1000);
        // console.log(currentImg);
        getRPlaceTiles(selectedRange);
    }
}

function drawTiles(tiles) {
    // ctx.setTransform(scale,0,0,scale,0,0);
    // ctx.scale(widthCanvas / widthView, heightCanvas / heightView);
    // ctx.translate(-xleftView, -ytopView);
    tiles.forEach(t => {
        let coordX = t.coordinate.split(',')[0].replace('"', '');
        let coordY = t.coordinate.split(',')[1].replace('"', '');
        // console.log(`${x},${y}: ${d.pixel_color}`);
        ctx.fillStyle = t.pixel_color;
        ctx.fillRect(coordX, coordY, 1, 1);
    });
    lmp.innerHTML = `Tiles Last Min: ${window.sessionStorage.getItem('lastMinPlaced')}`;
    tp.innerHTML = `Total Tiles Placed: ${window.sessionStorage.getItem('totalPlaced')}`;
}

function setRangeOutput(val) {
    document.getElementById('durRangeOutput').innerHTML = `Total Time: ${val} ${val == 1 ? 'min' : 'mins'}`;
}

function saveStats(data) {
    let currLen = data.length;
    let lastMin = parseInt(window.sessionStorage.getItem('totalPlaced'));
    window.sessionStorage.setItem('lastMinPlaced', String(currLen));
    window.sessionStorage.setItem('totalPlaced', String(lastMin + currLen));
}

// function handleDblClick(event) {
//     let X = event.clientX - this.offsetLeft - this.clientLeft + this.scrollLeft;  // Canvas coordinates
//     let Y = event.clientY = this.offsetTop - this.clientTop + this.scrollTop;
//     let x = X / widthCanvas * widthView + xleftView;
//     let y = Y / heightCanvas * heightView + ytopView;

//     let scale = event.shiftKey == 1 ? 1.5 : 0.5;  // shrink (1.5) if shift key pressed
//     widthView *= scale;
//     heightView *= scale;

//     if (widthView > widthViewOriginal || heightView > heightViewOriginal) {
//         widthView = widthViewOriginal;
//         heightView = heightViewOriginal;
//         x = widthView / 2;
//         y = heightView / 2;
//     }

//     xleftView = x - widthView / 2;
//     ytopView = y - heightView / 2;

//     drawTiles();
// }

// let mouseDown = false;

// function handleMouseDown(event) {
//     mouseDown = true;
// }

// function handleMouseUp(event) {
//     mouseDown = false;
// }

// let lastX = 0;
// let lastY = 0;
// function handleMouseMove(event) {

//     let X = event.clientX - this.offsetLeft - this.clientLeft + this.scrollLeft;
//     let Y = event.clientY - this.offsetTop - this.clientTop + this.scrollTop;

//     if (mouseDown) {
//         let dx = (X - lastX) / widthCanvas * widthView;
//         let dy = (Y - lastY) / widthCanvas * widthView;
//         xleftView = dx;
//         ytopView = dy;
//     }
//     lastX = X;
//     lastY = Y;

//     drawTiles();
// }

// function handleMouseWheel(event) {
//     let x = widthView / 2 + xleftView;  // View coordinates
//     let y = heightView / 2 + ytopView;

//     let scale = (event.wheelDelta < 0 || event.detail > 0) ? 1.1 : 0.9;
//     widthView *= scale;
//     heightView *= scale;

//     if (widthView > widthViewOriginal || heightView > heightViewOriginal) {
//         widthView = widthViewOriginal;
//         heightView = heightViewOriginal;
//         x = widthView / 2;
//         y = heightView / 2;
//     }

//     // scale about center of view, rather than mouse position. this is different than dblclick behavior
//     xleftView = x - widthView / 2;
//     ytopView = y - heightView / 2;

//     drawTiles();
// }