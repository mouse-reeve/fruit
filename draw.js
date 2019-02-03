var data = {};

// actual drawing
var black;
var white;

var canvas;
function setup() {
    var param_string = window.location.search.substr(1).split('&');
    var params = {};
    for (var i = 0; i < param_string.length; i++) {
        var pair = param_string[i].split('=');
        if (parseInt(pair[1]) == pair[1]) {
            radius = 0;
            pair[1] = parseInt(pair[1]);
        }
        params[pair[0]] = pair[1];
    }
    var seed = params.seed || Math.floor(Math.random() * 10000);
    randomSeed(seed);
    history.replaceState({}, '', 'index.html?seed=' + seed);

    var container = document.getElementById('fruit');
    canvas = createCanvas(500, 680);
    canvas.parent(container);

    black = color(0);
    white = color(255);
    // this is important
    colorMode(HSL, 100);

    push();
    noStroke();
    fill(color('#fef4d7'));
    rect(0, 0, width - 1, height - 1);
    push();
    pop();

    strokeWeight(2);
    stroke(color('#dac7a6'));
    rect(40, 40, width - 82, height - 82);
    pop();

    noLoop();
}

function draw() {
    var fruit = create_fruit();

    //  ___________
    // |     7     |
    // |   (   )   |
    // |     v     |
    // |           |
    // |     7     |
    // |   ((o))   |
    // |     v     |
    // |___________|
    push();
    translate(250, 200);
    draw_from_data(fruit.whole);
    pop();

    push();
    translate(250, 490);
    draw_from_data(fruit.cut);
    pop();
}

function draw_from_data(fruit) {
    if (Array.isArray(fruit[0])) {
        for (var f = 0; f < fruit.length; f++) {
            draw_from_data(fruit[f]);
        }
        return;
    }

    push();
    if (!fruit.stroke) {
        noStroke();
    } else {
        stroke(fruit.stroke);
        if (fruit.strokeWeight) {
            strokeWeight(fruit.strokeWeight);
        } else {
            strokeWeight(3);
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
