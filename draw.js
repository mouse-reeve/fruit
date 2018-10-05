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

    var core_data = {
        'side_a': [],
        'side_b': [],
        'all_points': [],
        'bezier_points': [],
    };

    var radius_y = radius_base;
    var radius_x = radius_base;
    var perturbation_y = 10;
    var perturbation_x = 25;
    var point_count = Math.round(random(4, 7));
    var control_radius = 120 / point_count;
    var angle = PI / point_count;

    // the first, non-bezier, vertex point
    core_data.side_a.push({x: x, y: y - radius_y, a: HALF_PI, type: 'anchor'});
    // create the first side
    for (var a = HALF_PI; a < 3 * HALF_PI; a += angle) {
        var sx1 = x + cos(a) * radius_x;
        var sy1 = y - sin(a) * radius_y;

        var cx1 = sx1 + cos(a + HALF_PI) * control_radius;
        var cy1 = sy1 - sin(a + HALF_PI) * control_radius;
        core_data.side_a.push({x: cx1, y: cy1, type: 'control'});

        radius_x += Math.round(random(-1 * perturbation_x, perturbation_x));
        radius_y += Math.round(random(-1 * perturbation_y, perturbation_y));

        var sx2 = x + cos(a + angle) * radius_x;
        var sy2 = y - sin(a + angle) * radius_y;

        var cx2 = sx2 - cos(a + angle + HALF_PI) * control_radius;
        var cy2 = sy2 + sin(a + angle + HALF_PI) * control_radius;
        core_data.side_a.push({x: cx2, y: cy2, type: 'control'});
        core_data.side_a.push({x: sx2, y: sy2, a: a + angle, type: 'anchor'});
    }
    core_data.all_points = core_data.side_a.slice(0);

    // add center two control points
    core_data.all_points.push({
        type: 'control',
        x: x + cos(TWO_PI) * control_radius,
        y: y - sin(TWO_PI) * control_radius,
    });
    core_data.all_points.push({
        type: 'control',
        x: x - cos(0) * control_radius,
        y: y + sin(0) * control_radius,
    });

    // mirror side a
    var reversed = core_data.side_a.map(function (point) {
        return {
            x: 2*x - point.x,
            y: point.y
        };
    });
    reversed.reverse();
    core_data.side_b = reversed;
    core_data.all_points = core_data.all_points.concat(reversed);
    core_data.all_points.push({x: x, y: y - radius_y, a: HALF_PI, type: 'anchor'});
    // cool
    fill(black);
    ellipse(250 - cos(PI) * radius_x, 150 + sin(PI) * radius_y, 5, 5);
    ellipse(250 - cos(HALF_PI) * radius_x, 150 + sin(HALF_PI) * radius_y, 5, 5);
    noFill();


    translate(250, 150);

    draw_shape(core_data.all_points);
    /*
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
    */
}

function draw_shape(points) {
    beginShape();
    vertex(points[0].x, points[0].y);
    for (var v = 1; v < points.length - 3; v+=3) {
        bezierVertex(
            points[v].x, points[v].y,
            points[v + 1].x, points[v + 1].y,
            points[v + 2].x, points[v + 2].y
        );
    }
    endShape(CLOSE);
}
