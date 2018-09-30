var data = {};

// actual drawing
var black;
var white;

function setup() {
    var seed = Math.floor(Math.random() * 10000);
    randomSeed(seed);
    console.log(seed);

    var container = document.getElementById('fruit');
    var canvas = createCanvas(1000, 600);
    canvas.parent(container);

    black = color(0);
    white = color(255);
    // this is important
    colorMode(HSL, 100);

    // 1px black outline around the canvas
    push();
    pop();
    stroke(black);
    fill(white);
    rect(0, 0, width - 1, height -1);

    noLoop();
}

function draw() {
    // draw a fruit centered at x,y
    x = 500;
    y = 250;

    var radius_base = 100;
    var radius_y = radius_base;
    var radius_x = radius_base;
    var perturbation_y = 10;
    var perturbation_x = 25;
    var points = Math.round(random(3, 10));

    outline = [];
    var radii = [];
    for (var a = HALF_PI + (PI / 20); a < 3 * HALF_PI; a += PI / points) {
        radius_x += Math.round(random(-1 * perturbation_x, perturbation_x));
        radius_y += Math.round(random(-1 * perturbation_y, perturbation_y));
        radii.push([radius_x, radius_y]);

        var sx = x + cos(a) * radius_x;
        var sy = y - sin(a) * radius_y;
        outline.push([sx, sy]);
    }

    var radii_cont = [];
    var idx = 0;
    for (var a = HALF_PI - (PI / 20); a > -1 * HALF_PI; a -= PI / points) {
        r = radii[idx];
        radius_x = r[0];
        radius_y = r[1];
        radii_cont.push(r);

        var sx = x + cos(a) * radius_x;
        var sy = y - sin(a) * radius_y;
        outline.splice(points, 0, [sx, sy]);
        idx++;
    }

    push();
    stroke(black);

    beginShape();
    noFill();
    vertex(x, y - radius_base);

    for (var v = 0; v < outline.length; v++) {
        vertex(outline[v][0], outline[v][1]);
    }
    endShape(CLOSE);
    pop();
}
