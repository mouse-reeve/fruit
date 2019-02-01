var data = {};

// actual drawing
var black;
var white;

function setup() {
    var seed = Math.floor(Math.random() * 10000);
    randomSeed(seed);
    console.log(seed);

    var container = document.getElementById('fruit');
    var canvas = createCanvas(580, 680);
    canvas.parent(container);

    black = color(0);
    white = color(255);
    // this is important
    colorMode(HSL, 100);

    // 1px black outline around the canvas
    push();
    noStroke();
    fill(color(15, 94, 92));
    rect(0, 0, width - 1, height - 1);
    push();
    pop();

    stroke(color(15, 94, 30));
    rect(40, 40, width - 82, height - 82);
    pop();

    noLoop();
}

var radius_base = 100;
function draw() {
    var fruit = create_fruit();

    draw_from_data(fruit.whole, 290, 200);
    draw_from_data(fruit.cut, 290, 490);
}

function draw_from_data(fruit, x, y) {
    if (Array.isArray(fruit[0])) {
        for (var f = 0; f < fruit.length; f++) {
            draw_from_data(fruit[f], x, y);
        }
        return;
    }

    push();
    translate(x, y);
    if (!fruit.stroke) {
        noStroke();
    } else {
        stroke(fruit.stroke);
        if (fruit.strokeWeight) {
            strokeWeight(fruit.strokeWeight);
        } else {
            strokeWeight(4);
        }
    }
    if (!!fruit.fill) {
        fill(fruit.fill);
    }

    beginShape();
    for (var v = 0; v < fruit.length; v++) {
        curveVertex(fruit[v].x, fruit[v].y);
    }
    endShape(CLOSE);

    pop();
}
