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
    // draw a fruit
    x = 0;
    y = 0;

    var shape = [];

    var radius_y = radius_base;
    var radius_x = radius_base;
    var perturbation_y = 10;
    var perturbation_x = 25;
    var point_count = Math.round(random(6, 8));
    var control_radius = 120 / point_count;
    var angle = PI / point_count;

    var start = {x: x, y: y - radius_y};
    // idk why the first point goes in twice but it does?
    shape.push(start);
    shape.push(start);
    // create the first side
    for (var a = HALF_PI; a < 3 * HALF_PI; a += angle) {
        radius_x += Math.round(random(-1 * perturbation_x, perturbation_x));
        radius_y += Math.round(random(-1 * perturbation_y, perturbation_y));
        var sx2 = x + cos(a + angle) * radius_x;
        var sy2 = y - sin(a + angle) * radius_y;
        shape.push({x: sx2, y: sy2});
    }

    // mirror side a
    var reversed = shape.map(function (point) {
        return {
            x: 2*x - point.x,
            y: point.y
        };
    });
    reversed.reverse();
    shape = shape.concat(reversed.slice(1));
    // cool

    draw_whole(shape, 250, 150);
    draw_cut(shape, 250, 450);
}

function draw_cut(shape, x, y) {
    // ------------------- whole ----------------------- \\
    push();
    translate(x, y);
    strokeWeight(5);
    stroke(black);

    // outside
    push();
    beginShape();
    fill('#f00');
    for (var v = 0; v < shape.length; v++) {
        curveVertex(shape[v].x, shape[v].y);
    }
    endShape(CLOSE);
    pop();
    push();
    beginShape();
    fill('#f80');
    for (var v = 0; v < shape.length; v++) {
        var sx = v < shape.length / 2 || v >= shape.length - 2 ? shape[v].x : shape[v].x * 0.9;
        curveVertex(sx, shape[v].y);
    }
    endShape(CLOSE);
    pop();

    // pit
    push();

    pop();

    pop();
}

function draw_whole(shape, x, y) {
    // ------------------- whole ----------------------- \\
    push();
    translate(x, y);
    strokeWeight(5);
    stroke(black);

    // outside
    push();
    beginShape();
    fill('#f00');
    for (var v = 0; v < shape.length; v++) {
        curveVertex(shape[v].x, shape[v].y);
    }
    endShape(CLOSE);
    pop();

    scale(0.8, 0.8);
    // details
    noFill();
    beginShape();
    var start = Math.round(1.3 * shape.length / 3.5);
    var end = Math.round(2 * start);
    for (var v = start; v < end; v++) {
        curveVertex(
            shape[v].x,
            shape[v].y
        );
    }
    endShape();

    push();
    stroke(white);
    beginShape();
    curveVertex(
        shape[2].x,
        shape[2].y
    );
    for (var v = 2; v < shape.length / 3.5; v++) {
        curveVertex(
            shape[v].x,
            shape[v].y
        );
    }
    endShape();
    pop();
    pop();
}
