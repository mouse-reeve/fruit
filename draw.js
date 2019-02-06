var data = {};

// actual drawing
var black;
var white;

var canvas;
var canvas_origin;
var canvas_height;
var canvas_width;
var artists;
function preload() {
      artists = [
          ['Inald Machardon', loadFont('fonts/Calligraffitti/Calligraffitti-Regular.ttf')],
          ['O. Edophi', loadFont('fonts/Caveat/Caveat-Regular.ttf')],
          ['Artenbel Naugell', loadFont('fonts/Nanum_Brush_Script/NanumBrushScript-Regular.ttf')],
          ['J Blichauphs', loadFont('fonts/Dawning_of_a_New_Day/DawningofaNewDay.ttf')],
          ['AA Lusfor', loadFont('fonts/Kristi/Kristi-Regular.ttf')],
          ['Yysl Hadnehn', loadFont('fonts/La_Belle_Aurore/LaBelleAurore.ttf')],
          ['Pesmar Den', loadFont('fonts/Architects_Daughter/ArchitectsDaughter-Regular.ttf')],
          ['Farlaçon Mercanus', loadFont('fonts/Zeyada/Zeyada.ttf')],
          ['Jixabbolt Serger', loadFont('fonts/Loved_by_the_King/LovedbytheKing.ttf')],
          ['Phinsiær', loadFont('fonts/Reenie_Beanie/ReenieBeanie.ttf')],
      ];
}
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
    canvas = createCanvas(800, 780);//500, 680);
    canvas.parent(container);

    black = color(0);
    white = color(255);
    // this is important
    colorMode(HSL, 100);

    canvas_origin = {x: 150, y: 50};
    canvas_width = 500;
    canvas_height = 680;
    push();
    noStroke();
    fill('#FFFDE8');
    rect(0, 0, width, height);

    fill(black);
    rect(
        canvas_origin.x - 10,
        canvas_origin.y - 15,
        canvas_width + 20,
        canvas_height + 30
    );

    fill(color('#fef4d7'));
    rect(
        canvas_origin.x,
        canvas_origin.y,
        canvas_width,
        canvas_height
    );

    strokeWeight(2);
    stroke(color('#dac7a6'));
    noFill();
    rect(
        canvas_origin.x + 40,
        canvas_origin.y + 40,
        canvas_width - 80,
        canvas_height - 80
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
        // |  (   )|  |
        // |    v(   ) |
        // |   7   v   |
        // | ((o))     |
        // |   v       |
        // |___________|
        push();
        translate(canvas_origin.x, canvas_origin.y);
        draw_from_data(fruit.branch);

        fill('#f00');
        for (var i = 3; i < fruit.branch.length / 2 - 1; i++) {
            push();

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

        var bottom = fruit.radius_base > 60 ? canvas_height - fruit.radius_base * 2 : 510;
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
        translate(canvas_origin.x + 250, canvas_origin.y + 200);
        draw_from_data(fruit.whole);
        pop();

        push();
        translate(canvas_origin.x + 250, canvas_origin.y + 490);
        draw_from_data(fruit.cut);
        pop();
    }

    // text + signature
    //
    var artist = random(artists);
    var year = Math.round(random(2087, 2139));

    push();
    textSize(15);
    fill(color('#8D7553'));
    textAlign(RIGHT);
    textFont(artist[1]);
    text(
        artist[0],
        canvas_origin.x + canvas_width - 60,
        canvas_origin.y + canvas_height - 65
    )
    text(
        year,
        canvas_origin.x + canvas_width - 60,
        canvas_origin.y + canvas_height - 50
    )

    var parchment = color('#fef4d7');
    noStroke();
    for (var i = 0; i < 3; i++) {
        parchment.setAlpha(30);
        fill(parchment);
        ellipse(
            canvas_origin.x + canvas_width - random(50, 150),
            canvas_origin.y + canvas_height - random(50, 80), 80, 30);
    }
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
