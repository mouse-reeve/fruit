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

    vertices = [];
    for (var a = HALF_PI + (PI / 20); a < 3 * HALF_PI; a += PI / points) {
        radius_x += Math.round(random(-1 * perturbation_x, perturbation_x));
        radius_y += Math.round(random(-1 * perturbation_y, perturbation_y));
        vertices.push({
            x: x + cos(a) * radius_x,
            y: y - sin(a) * radius_y,
        });
    }

    // then go back up the same way
    var reversed = vertices.map(function(v) {
        return {x: 2 * x - v.x, y: v.y};
    });
    // reverse the order so it draws correctly around the circle
    reversed.reverse();

    var all_vertices = vertices;
    all_vertices = all_vertices.concat(reversed);

    push();
    stroke(black);

    beginShape();
    noFill();
    vertex(x, y - radius_base);

    for (var v = 0; v < all_vertices.length; v++) {
        vertex(all_vertices[v].x, all_vertices[v].y);
    }
    endShape(CLOSE);
    pop();
}

