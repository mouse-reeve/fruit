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

    var radius_y = radius_base;
    var radius_x = radius_base;
    var perturbation_y = 10;
    var perturbation_x = 25;
    var points = Math.round(random(4, 7));
    var control_radius = 120 / points;

    var radii = [];
    var angle = PI / points;
    var base_shape = [];
    for (var a = HALF_PI; a < 3 * HALF_PI; a += angle) {
        var sx1 = x + cos(a) * radius_x;
        var sy1 = y - sin(a) * radius_y;

        var cx1 = sx1 + cos(a + HALF_PI) * control_radius;
        var cy1 = sy1 - sin(a + HALF_PI) * control_radius;

        radius_x += Math.round(random(-1 * perturbation_x, perturbation_x));
        radius_y += Math.round(random(-1 * perturbation_y, perturbation_y));
        radii.push(radius_y);
        radii.push(radius_x);

        var sx2 = x + cos(a + angle) * radius_x;
        var sy2 = y - sin(a + angle) * radius_y;

        var cx2 = sx2 - cos(a + angle + HALF_PI) * control_radius;
        var cy2 = sy2 + sin(a + angle + HALF_PI) * control_radius;

        var base_shape_point = [
            cx1, cy1,
            cx2, cy2,
            sx2, sy2
        ];
        // stash this so I can make concentric shapes
        base_shape_point.radius = [radius_x, radius_y];
        base_shape_point.angle = a;
        base_shape.push(base_shape_point);
    }

    noStroke();
    translate(250, 150);
    // outside
    push();
    scale(-1, 1);
    fill('#f00');
    draw_shape(base_shape);
    pop();

    // shadow
    push();
    scale(0.4, 0.4);
    translate(-50, -30);
    fill(100, 100, 100, 40);
    draw_shape(base_shape, -0.3);
    pop();

    translate(0, 250);

    // peel
    push();
    fill(black);
    draw_shape(base_shape);
    pop();

    var running_scale = 0.98;
    // pith
    push();
    scale(running_scale, running_scale);
    fill('#b00');
    draw_shape(base_shape);
    pop();

    // meat
    running_scale -= 0.05;
    push();
    scale(running_scale, running_scale);
    fill('#f88');
    draw_shape(base_shape);
    pop();

    // pit
    push();
    scale(0.3, 0.7);
    fill('#500');
    draw_shape(base_shape);
    pop();
}

function draw_shape(vertices, x_scale_factor) {
    x_scale_factor = x_scale_factor || -1;
    for (var i = 0; i < 2; i++) {
        beginShape();
        vertex(x, y - radius_base);

        for (var v = 0; v < vertices.length; v++) {
            bezierVertex(...vertices[v]);
            //ellipse(vertices[v][4], vertices[v][5], 5, 5);
            /*push();
            fill(black);
            ellipse(vertices[v][0], vertices[v][1], 2, 2);
            ellipse(vertices[v][2], vertices[v][3], 2, 2);
            pop();*/
        }
        endShape(CLOSE);
        scale(x_scale_factor, 1);
    }
}
