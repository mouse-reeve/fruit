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

    var outside = [];

    var radius_y = radius_base;
    var radius_x = radius_base;
    var perturbation_y = 10;
    var perturbation_x = 25;
    var point_count = Math.round(random(6, 8));
    var control_radius = 120 / point_count;
    var angle = PI / point_count;

    var start = {x: x, y: y - radius_y};
    // idk why the first point goes in twice but it does?
    outside.push(start);
    outside.push(start);
    // create the first side
    for (var a = HALF_PI; a < 3 * HALF_PI; a += angle) {
        radius_x += Math.round(random(-1 * perturbation_x, perturbation_x));
        radius_y += Math.round(random(-1 * perturbation_y, perturbation_y));
        var sx2 = x + cos(a + angle) * radius_x;
        var sy2 = y - sin(a + angle) * radius_y;
        outside.push({x: sx2, y: sy2});
    }

    // mirror side a
    var reversed = outside.map(function (point) {
        return {
            x: 2*x - point.x,
            y: point.y
        };
    });
    reversed.reverse();
    outside = outside.concat(reversed.slice(1));

    // inside
    var inside = [];
    for (var v = 0; v < outside.length; v++) {
        var sx = v < outside.length / 2 || v >= outside.length - 2 ? outside[v].x : outside[v].x * 0.9;
        inside.push({x: sx, y: outside[v].y});
    }

    // core
    var core = [];
    var core_size = 0.7;
    for (var v = 0; v < outside.length; v++) {
        var sx = v < 2 || v >= outside.length - 2 ? outside[v].x : outside[v].x * core_size;
        var sy = v < 2 || v >= outside.length - 2 || v == Math.floor(outside.length / 2) ? outside[v].y * 0.99 : outside[v].y * core_size;
        sx = v < outside.length / 2 || v >= outside.length - 2 ? sx : sx * 0.9;
        core.push({x: sx, y: sy});
    }

    // pit
    var pit_size = random(0.3, 0.7);
    var pit = [{x: outside[0].x, y: outside[0].y * pit_size * 1.1}];
    for (var v = 1; v < outside.length; v+=2) {
        var sx = v < 2 || v >= outside.length - 2 ? outside[v].x : outside[v].x * pit_size;
        var sy = v < 2 || v >= outside.length - 2 ? outside[v].y * (pit_size * 1.1) : outside[v].y * pit_size;
        sx = v < outside.length / 2 || v >= outside.length - 2 ? sx : sx * 0.9;
        pit.push({x: sx, y: sy});
    }

    fruit = {outside, inside, core, pit}
    // cool

    draw_whole(fruit, 250, 150);
    draw_cut(fruit, 250, 450);
}

function draw_cut(fruit, x, y) {
    // ------------------- whole ----------------------- \\
    push();
    translate(x, y);
    strokeWeight(5);
    stroke(black);

    // outside
    push();
    fill('#f00');
    beginShape();
    for (var v = 0; v < fruit.outside.length; v++) {
        curveVertex(fruit.outside[v].x, fruit.outside[v].y);
    }
    endShape(CLOSE);
    pop();

    // inside
    push();
    fill('#f80');
    beginShape();
    for (var v = 0; v < fruit.inside.length; v++) {
        curveVertex(fruit.inside[v].x, fruit.inside[v].y);
    }
    endShape(CLOSE);
    pop();

    push();
    noStroke();
    fill('#f60');
    beginShape();
    for (var v = 0; v < fruit.core.length; v++) {
        curveVertex(fruit.core[v].x, fruit.core[v].y);
    }
    endShape(CLOSE);
    pop();

    push();
    fill('#ff0');
    beginShape();
    for (var v = 0; v < fruit.pit.length; v++) {
        curveVertex(fruit.pit[v].x, fruit.pit[v].y);
    }
    endShape(CLOSE);
    pop();

    pop();
}

function draw_whole(fruit, x, y) {
    // ------------------- whole ----------------------- \\
    push();
    translate(x, y);
    strokeWeight(5);
    stroke(black);

    // outside
    push();
    beginShape();
    fill('#f00');
    for (var v = 0; v < fruit.outside.length; v++) {
        curveVertex(fruit.outside[v].x, fruit.outside[v].y);
    }
    endShape(CLOSE);
    pop();

    scale(0.8, 0.8);
    // details
    noFill();
    beginShape();
    var start = Math.round(1.3 * fruit.outside.length / 3.5);
    var end = Math.round(2 * start);
    for (var v = start; v < end; v++) {
        curveVertex(
            fruit.outside[v].x,
            fruit.outside[v].y
        );
    }
    endShape();

    push();
    stroke(white);
    beginShape();
    curveVertex(
        fruit.outside[2].x,
        fruit.outside[2].y
    );
    for (var v = 2; v < fruit.outside.length / 3.5; v++) {
        curveVertex(
            fruit.outside[v].x,
            fruit.outside[v].y
        );
    }
    endShape();
    pop();
    pop();
}
