
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
    // the general parameters of the fruit
    var spec = get_spec_fruit();
    if (spec.radius_base >= 50 && random() > 0.8) {
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

        var branch = get_branch(spec);
        draw_from_data(branch);


        // draw more fruits on stem
        var fruit;
        var fruit_max = (branch[0].length / 2) - 1;
        for (var i = 3; i < fruit_max; i++) {
            push();
            var stem_start = branch[0][i];
            var stem_end =  {
                x: branch[0][i].x + (9 * (i - ((fruit_max + 3) / 2))) + random(-10, 10),
                y: branch[0][i].y + random(spec.radius_base * 0.7, spec.radius_base * 1)
            };
            var stem = get_connecting_stem(
                stem_start,
                stem_end,
                spec,
            );
            draw_from_data(stem);
            push();
            fruit = get_actual_fruit(spec, true);
            var theta = HALF_PI + atan2((stem_start.y - stem_end.y), (stem_start.x - stem_end.x));
            translate(
                stem_end.x - fruit.inside[0].x,
                stem_end.y - fruit.inside[0].y,
            );
            rotate(theta);
            // re-set the stem with the fruit
            var dist = fruit.inside[0].y * sin(theta) / sin((PI - theta) / 2)
            translate(
                dist * cos(theta),
                dist * sin(theta)
            );
            draw_from_data(fruit.outside);
            pop();

            pop();
        }

        var bottom = fruit.radius_base > 60 ? paper_height - fruit.radius_base * 2 : 510;
        translate(200, bottom);
        var fruit = get_actual_fruit(spec);
        draw_from_data(fruit.cut);
        pop();
    } else if (spec.ave_radius > 80 && random() > 0.7) {
        //  ___________
        // |           |
        // |           |
        // |    7      |
        // |  (  _)_ , |
        // |   `/(o))/ |
        // |    `---'  |
        // |           |
        // |___________|
        var fruit = get_actual_fruit(spec);
        push();
        translate(paper_origin.x + 200, paper_origin.y + (paper_height * 0.4));
        draw_from_data(fruit.outside);
        pop();

        push();
        translate(paper_origin.x + 300, paper_origin.y + (paper_height * 0.4) + (spec.radius_base));
        rotate(PI/5);
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
        var fruit = get_actual_fruit(spec);
        draw_from_data(fruit.outside);
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
    //var fact = fruit_fact(name, fruit);
    //document.getElementById('fact').innerText = fact;
}

function draw_from_data(data) {
    if (Array.isArray(data[0])) {
        for (var f = 0; f < data.length; f++) {
            draw_from_data(data[f]);
        }
        return;
    }

    push();
    if (!data.stroke) {
        noStroke();
    } else {
        stroke(data.stroke);
        if (data.strokeWeight) {
            strokeWeight(data.strokeWeight);
        } else {
            strokeWeight(3);
        }
    }
    if (!!data.fill) {
        fill(data.fill);
    }

    beginShape();
    for (var v = 0; v < data.length; v++) {
        curveVertex(data[v].x, data[v].y);
    }
    endShape(CLOSE);

    pop();
}
