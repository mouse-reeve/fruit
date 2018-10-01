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

var radius_base = 100;
function draw() {
    // draw a fruit centered at x,y
    x = 500;
    y = 250;

    var radius_y = radius_base;
    var radius_x = radius_base;
    var perturbation_y = 10;
    var perturbation_x = 25;
    var points = 5;//Math.round(random(2, 5)) * 2;
    var control_radius = 120 / points;

    var radii = [];
    var outline = [];
    var center_offset = PI / 20;
    var angle = PI / points;
    for (var a = HALF_PI + center_offset; a < 5 * HALF_PI; a += angle) {
        if (a < 3 * HALF_PI) {
            radii.push(radius_y);
            radii.push(radius_x);
        } else {
            radius_x = radii.pop();
            radius_y = radii.pop();
        }
        var sx1 = x + cos(a) * radius_x;
        var sy1 = y - sin(a) * radius_y;

        var cx1 = sx1 + cos(a + HALF_PI) * control_radius;
        var cy1 = sy1 - sin(a + HALF_PI) * control_radius;

        if (a < 3 * HALF_PI - angle) {
            radius_x += Math.round(random(-1 * perturbation_x, perturbation_x));
            radius_y += Math.round(random(-1 * perturbation_y, perturbation_y));
            radii.push(radius_y);
            radii.push(radius_x);
        } else {
            radius_x = radii.pop() + random(-3, 3);
            radius_y = radii.pop() + random(-3, 3);
        }
        var sx2 = x + cos(a + angle) * radius_x;
        var sy2 = y - sin(a + angle) * radius_y;

        var cx2 = sx2 - cos(a + angle + HALF_PI) * control_radius;
        var cy2 = sy2 + sin(a + angle + HALF_PI) * control_radius;

        var outline_point = [
            cx1, cy1,
            cx2, cy2,
            sx2, sy2
        ];
        // stash this so I can make concentric shapes
        outline_point.radius = [radius_x, radius_y];
        outline_point.angle = a;
        outline.push(outline_point);
    }


    push();
    stroke(black);

    beginShape();
    noFill();
    vertex(x, y - radius_base);
    for (var v = 0; v < outline.length; v++) {
        bezierVertex(...outline[v]);
        //ellipse(outline[v][4], outline[v][5], 5, 5);
        /*push();
        fill(black);
        ellipse(outline[v][0], outline[v][1], 2, 2);
        ellipse(outline[v][2], outline[v][3], 2, 2);
        pop();*/
    }
    endShape(CLOSE);
    pop();
}

