var data = {};

// actual drawing
var black;
var white;

function setup() {
    var seed = Math.floor(Math.random() * 10000);
    randomSeed(seed);
    console.log(seed);

    var container = document.getElementById('fruit');
    var canvas = createCanvas(500, 600);
    canvas.parent(container);

    black = color(0);
    white = color(255);
    // this is important
    colorMode(HSL, 100);

    // 1px black outline around the canvas
    push();
    pop();
    stroke(black);
    rect(0, 0, width - 1, height -1);

    noLoop();
}

var radius_base = 100;
function draw() {
    var fruit = create_fruit();

    draw_from_data(fruit.outside, 250, 150);
    draw_from_data(fruit.outside, 250, 450);
    draw_from_data(fruit.inside, 250, 450);
    draw_from_data(fruit.core, 250, 450);
    draw_from_data(fruit.pit, 250, 450);
}

function draw_from_data(fruit, x, y) {
    if (Array.isArray(fruit[0])) {
        for (var f = 0; f < fruit.length; f++) {
            draw_from_data(f, x, y);
        }
        return;
    }

    push();
    translate(x, y);
    strokeWeight(5);
    if (!fruit.stroke) {
        noStroke();
    } else {
        stroke(fruit.stroke);
    }
    if (fruit.fill) {
        fill(fruit.fill);
    }

    beginShape();
    for (var v = 0; v < fruit.length; v++) {
        curveVertex(fruit[v].x, fruit[v].y);
    }
    endShape(CLOSE);

    pop();
}
