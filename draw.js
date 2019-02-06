var data = {};

// actual drawing
var black;
var white;

var paper_origin;
var paper_height;
var paper_width;

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
    var canvas = createCanvas(800, 780);
    canvas.parent(container);
    paper_origin = {x: 150, y: 50};
    paper_width = 500;
    paper_height = 680;

    black = color(0);
    white = color(255);

    // this is important
    colorMode(HSL, 100);

    push();
    noStroke();

    // background matting
    fill('#FFFDE8');
    rect(0, 0, width, height);

    // black border around the drawing paper
    fill(black);
    rect(
        paper_origin.x - 10,
        paper_origin.y - 15,
        paper_width + 20,
        paper_height + 30
    );

    // drawing's paper
    fill(color('#fef4d7'));
    rect(
        paper_origin.x,
        paper_origin.y,
        paper_width,
        paper_height
    );

    // brown border margin on the paper
    strokeWeight(2);
    stroke(color('#dac7a6'));
    noFill();
    rect(
        paper_origin.x + 40,
        paper_origin.y + 40,
        paper_width - 80,
        paper_height - 80
    );
    pop();
    noLoop();
}

function draw() {
    var fruit = create_fruit();

    if (random() > 0.9) {
        //  ___________
        // |  _______  |
        // |    7  7   |
        // |  (   )|   |
        // |    v(   ) |
        // |   7   v   |
        // | ((o))     |
        // |   v       |
        // |___________|
        push();
        translate(paper_origin.x, paper_origin.y);
        draw_from_data(fruit.branch);

        // draw more fruits on stem
        for (var i = 3; i < fruit.branch.length / 2 - 1; i++) {
            push();

            // deepy copy stem coords
            var modified_stem = fruit.whole[0].map(function(point) {
                return Object.assign({}, point);
            });
            modified_stem.fill = fruit.whole[0].fill;
            modified_stem.stroke = fruit.whole[0].stroke;

            var jitter = fruit.branch.length / 2 > 5 ? random(-5, 35) : 0;
            for (var j = 3; j <= 8; j++) {
                modified_stem[j].x += jitter * cos(PI / 7);
                modified_stem[j].y -= jitter * sin(PI / 7);
            }

            var theta = (Math.round(fruit.branch.length / 4) - i) * PI / 9;
            translate(fruit.branch[i].x, fruit.branch[i].y - 3);
            rotate(theta);
            translate(0 - modified_stem[7].x, 0 - modified_stem[7].y);
            draw_from_data([modified_stem, fruit.whole[1]]);
            pop();
        }

        var bottom = fruit.radius_base > 60 ? paper_height - fruit.radius_base * 2 : 510;
        translate(200, bottom);
        draw_from_data(fruit.cut);
        pop();
    } else {
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
        translate(paper_origin.x + 250, paper_origin.y + 200);
        draw_from_data(fruit.whole);
        pop();

        push();
        translate(paper_origin.x + 250, paper_origin.y + 490);
        draw_from_data(fruit.cut);
        pop();
    }

    // text + signature
    var artists = [
        ['Inald Machardon', 'inald machardon', 'Kristi'],
        ['Olia Shaulsene Boot Edophi', 'O. Edophi', 'Caveat'],
        ['Artenbel Naugell', 'Artenbel Naugell', 'Nanum Brush Script'],
        ['Józat Blichauphs', 'J Blichauphs', 'Dawning of a New Day'],
        ['Auro Alese Lusfor', 'AA Lusfor', 'Kristi'],
        ['Yysl Hadnehn', 'Yysl Hadnehn', 'La Belle Aurore'],
        ['Pesmar Den', 'Pesmar Den','Architects Daughter'],
        ['Farlaçon Mercanus', 'Farlaçon Mercanus', 'Zeyada'],
        ['Jixabbolt Serger', 'Jixabbolt Serger', 'Loved by the King'],
        ['Phinsiær', 'Phinsiær', 'Reenie Beanie'],
    ];
    var artist = random(artists);
    var year = Math.round(random(2087, 2139));

    push();
    textSize(15);
    fill(color('#8D7553'));
    textAlign(RIGHT);
    textFont(artist[2]);
    text(
        artist[1],
        paper_origin.x + paper_width - 60,
        paper_origin.y + paper_height - 65
    );
    text(
        year,
        paper_origin.x + paper_width - 60,
        paper_origin.y + paper_height - 50
    );

    var parchment = color('#fef4d7');
    noStroke();
    for (var p = 0; p < 3; p++) {
        parchment.setAlpha(20);
        fill(parchment);
        ellipse(
            paper_origin.x + paper_width - random(50, 150),
            paper_origin.y + paper_height - random(50, 80), 80, 30
        );
    }
    pop();

    document.getElementById('description').innerText = 'by ' + artist[0] + ', ' + year;
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
