
// actual drawing
var black;
var white;

var paper_origin;
var paper_height;
var paper_width;
var seed;

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
    seed = params.seed || Math.floor(Math.random() * 10000);
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

    // crosswise is a horizontal slice, cut is a vertical slice
    var cut = random([
        fruit.crosswise,
        fruit.cut,
        fruit.cut,
        fruit.cut,
        fruit.cut,
        fruit.cut,
        fruit.cut,
    ]);
    if (fruit.pit_type == 'pit') {
        // don't do a crosswise cut on a pitted fruit
        cut = fruit.cut;
    } else if (fruit.pit_type == 'segments') {
        // right now cross cuts work much better for segmented fruit
        cut = random([
            fruit.crosswise,
            fruit.crosswise,
            fruit.crosswise,
            fruit.crosswise,
            fruit.crosswise,
            fruit.cut
        ]);
    }
    if (fruit.radius_base >= 50 && random() > 0.8) {
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
        for (var i = 3; i < fruit.branch[0].length / 2 - 1; i++) {
            push();

            // deep copy stem coords
            var modified_stem = fruit.whole[0].map(function(point) {
                return Object.assign({}, point);
            });
            modified_stem.fill = fruit.whole[0].fill;
            modified_stem.stroke = fruit.whole[0].stroke;

            var jitter = fruit.branch[0].length / 2 > 5 ? random(-5, 35) : 0;
            for (var j = 3; j <= 8; j++) {
                modified_stem[j].x += jitter * cos(PI / 7);
                modified_stem[j].y -= jitter * sin(PI / 7);
            }

            var stem_end_index = Math.floor(modified_stem.length / 2);
            var theta = (Math.round(fruit.branch[0].length / 4) - i) * PI / 9;
            translate(fruit.branch[0][i].x, fruit.branch[0][i].y - 3);
            rotate(theta);
            translate(0 - modified_stem[stem_end_index].x, 0 - modified_stem[stem_end_index].y);
            draw_from_data([modified_stem, fruit.whole[1]]);
            pop();
        }

        var bottom = fruit.radius_base > 60 ? paper_height - fruit.radius_base * 2 : 510;
        translate(200, bottom);
        draw_from_data(cut);
        pop();
    } else if (fruit.ave_radius > 80 && random() > 0.7) {
        //  ___________
        // |           |
        // |           |
        // |    7      |
        // |  (  _)_ , |
        // |   `/(o))/ |
        // |    `---'  |
        // |           |
        // |___________|
        push();
        translate(paper_origin.x + 200, paper_origin.y + (paper_height * 0.4));
        draw_from_data(fruit.whole);
        pop();

        push();
        translate(paper_origin.x + 300, paper_origin.y + (paper_height * 0.4) + (fruit.radius_base));
        rotate(PI/5);
        draw_from_data(cut);
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
        draw_from_data(cut);
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
    var name = get_name(fruit.ave_radius, fruit.pit_type);

    push();
    textSize(15);
    fill(color('#8D7553'));
    textFont(artist[2]);

    // seed
    text(
        '#' + seed,
        paper_origin.x + 55,
        paper_origin.y + paper_height - 65
    );

    // fruit name
    text(
        name,
        paper_origin.x + 55,
        paper_origin.y + paper_height - 55
    );

    textAlign(RIGHT);
    // artist name
    text(
        artist[1],
        paper_origin.x + paper_width - 60,
        paper_origin.y + paper_height - 65
    );

    // year
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

    document.getElementById('description').innerText = name + ', by ' + artist[0] + ', ' + year;

    // fun fact followup
    var fact = fruit_fact(name, fruit);
    document.getElementById('fact').innerText = fact;
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
