function create_fruit() {
    x = 0;
    y = 0;

    var base_shape = [];

    var radius_y = radius_base;
    var radius_x = radius_base;
    var perturbation_y = 10;
    var perturbation_x = 25;
    var point_count = Math.round(random(6, 8));
    var control_radius = 120 / point_count;
    var angle = PI / point_count;

    var start = {x: x, y: y - radius_y};
    // idk why the first point goes in twice but it does?
    base_shape.push(start);
    base_shape.push(start);
    // create the first side
    for (var a = HALF_PI; a < 3 * HALF_PI; a += angle) {
        radius_x += Math.round(random(-1 * perturbation_x, perturbation_x));
        radius_y += Math.round(random(-1 * perturbation_y, perturbation_y));
        var sx2 = x + cos(a + angle) * radius_x;
        var sy2 = y - sin(a + angle) * radius_y;
        base_shape.push({x: sx2, y: sy2});
    }

    // mirror side a
    var reversed = base_shape.map(function (point) {
        var jitter = random(radius_base / -30, radius_base / 30);
        return {
            x: (2 * x) - point.x + jitter,
            y: point.y + jitter,
        };
    });
    reversed.reverse();
    base_shape = base_shape.concat(reversed.slice(1));

    var params = {
        divot_offset: random(0, 0.2),
        radius_y: radius_y,
        top_points: [0, 1, base_shape.length - 2, base_shape.length - 1],
    };

    // --- palette

    var skin_color = color(
        get_hue(-10, 40),
        random(55, 100),
        random(10, 80),
        100
    );
    var flesh_color = color(
        get_hue(5, 15),
        random(90, 100),
        random(40, 95),
        100
    );
    var outside = get_outside(base_shape, params, skin_color);
    var inside = get_inside(outside, params, flesh_color);
    var stem = get_stem(inside, color(10, 65, 40));


    var core_colors = [
        color(
            add_hue(hue(flesh_color), random(-5, 5)),
            saturation(flesh_color),
            lightness(flesh_color) - random(9, 18),
            100
        )
    ];
    core_colors.push(
        color(
            hue(core_colors[0]),
            saturation(core_colors[0]),
            lightness(core_colors[0]) - 7,
            100
        )
    );

    var core = get_core(outside, params, core_colors);

    var pit_color = color(10, 65, random(30, 60));
    var pit = get_pit(outside, pit_color);
    var seeds = get_seeds(base_shape, params, pit_color);
    outside = [outside, get_highlight(outside)];

    var whole = [stem, outside];
    var cut = [outside, inside, core, random([seeds, pit]), stem];
    return {cut, whole};
}

function get_outside(base_shape, params, color) {
    var outside = base_shape.slice(0);

    // add top dip
    for (var i = 0; i < params.top_points.length; i++) {
        outside[params.top_points[i]] = {x: base_shape[0].x, y: base_shape[0].y + (params.radius_y * params.divot_offset)};
    }

    outside.stroke = black;
    outside.fill = color;
    return outside;
}

function get_stem(inside, fill_color) {
    var origin = inside[0]
    var stem_length = 50;
    var stem = [
        {x: origin.x - 3, y: origin.y},
        {x: origin.x - 3, y: origin.y},
        {x: origin.x - 7, y: origin.y - stem_length/2},
        {x: origin.x - 2, y: origin.y - stem_length},
        {x: origin.x + 7, y: origin.y - stem_length},
        {x: origin.x + 2, y: origin.y - stem_length/2},
        {x: origin.x + 3, y: origin.y - 2},
        {x: origin.x + 3, y: origin.y - 2},
    ];

    stem.fill = fill_color;
    stem.stroke = black;
    stem.strokeWeight = 3;
    return stem;
}

function get_highlight(shape) {
    var highlight = [];

    var start = 2;
    var end = Math.round(shape.length / 3);
    end = end <= 3 ? 4 : end;
    for (var v = start; v < end; v++) {
        highlight.push({x: shape[v].x * 0.9, y: shape[v].y * 0.9});
    }
    for (var v = end - 2; v >= start; v--) {
        highlight.push({x: shape[v].x * 0.7, y: shape[v].y * 0.7});
    }
    highlight.fill = color(100, 100, 100, 50);

    return highlight;
}

function get_inside(outside, params, fill_color) {
    // flesh
    var inside = [];
    for (var v = 0; v < outside.length; v++) {
        var sx = v < outside.length / 2 || v >= outside.length - 2 ? outside[v].x : outside[v].x * 0.9;
        inside.push({x: sx, y: outside[v].y});
    }

    // add inside top dip
    var divot_offset = params.divot_offset * 1.5;
    for (var i = 0; i < params.top_points.length; i++) {
        inside[params.top_points[i]] = {x: outside[0].x, y: outside[0].y + (params.radius_y * divot_offset)};
    }

    inside.stroke = black;
    inside.fill = fill_color;
    return inside;
}

function get_core(outside, params, fill_color) {
    var cores = [[], []];
    var core_size = 0.7;
    for (var v = 0; v < outside.length; v++) {
        var sx = v < 2 || v >= outside.length - 2 ? outside[v].x : outside[v].x * core_size;
        var sy = v < 2 || v >= outside.length - 2 || v == Math.floor(outside.length / 2) ? outside[v].y * 0.99 : outside[v].y * core_size;
        sx = v < outside.length / 2 || v >= outside.length - 2 ? sx : sx * 0.9;
        cores[0].push({x: sx, y: sy});
    }

    var divot_offset = params.divot_offset * 2.2;
    for (var i = 0; i < params.top_points.length; i++) {
        cores[0][params.top_points[i]] = {x: outside[0].x, y: outside[0].y + (params.radius_y * divot_offset)};
    }

    cores[0].fill = fill_color[0];

    // CORE PART TWO
    core_size = 0.2;
    for (var v = 0; v < outside.length; v++) {
        var sx = v < 2 || v >= outside.length - 2 ? outside[v].x : outside[v].x * core_size * 1.2;
        var sy = v < 2 || v >= outside.length - 2 || v == Math.floor(outside.length / 2) ? outside[v].y * 0.8 : outside[v].y * core_size;
        sx = v < outside.length / 2 || v >= outside.length - 2 ? sx : sx * 0.8;
        cores[1].push({x: sx, y: sy});
    }

    var divot_offset = params.divot_offset;
    for (var i = 0; i < params.top_points.length; i++) {
        cores[1][params.top_points[i]] = {x: cores[1][0].x, y: cores[1][0].y + (params.radius_y * divot_offset)};
    }

    cores[1].fill = fill_color[1];
    return cores;
}

function get_seeds(outside, params, fill_color) {
    var seeds = [];
    for (var v = 2; v < outside.length - 3; v++) {
        if (v == Math.floor(outside.length / 2) - 1) {
            v += 1;
        }
        var seed = [];
        var p1 = outside[v];
        var p2 = outside[v + 1];
        var mx = ((p1.x + p2.x) / 2) * 0.2;
        var my = ((p1.y + p2.y) / 2) * 0.2;
        var radius = get_distance({x: 0, y: 0}, outside[3]) * 0.4;
        var theta = get_corner_angle(outside[0], {x: 0, y: 0}, p2);
        if (v < (outside.length / 2) - 1) {
            theta = (3 * PI / 2) - theta;
        } else {
            theta = (3 * PI / 2) + theta;
        }
        seed.push({x: mx, y: my});
        seed.push({x: mx, y: my});
        seed.push({x: radius * cos(theta), y: radius * sin(theta)});
        seed.push({x: radius * cos(theta + (PI / 12)), y: radius * sin(theta + (PI / 12))});
        seed.fill = fill_color;

        seed.stroke = color(hue(fill_color), saturation(fill_color), 25);
        seed.strokeWeight = 2;
        seeds.push(seed);
    }
    return seeds;
}

function get_pit(base_shape, fill_color) {
    var pit_size = random(0.3, 0.5);
    var pit = [{x: base_shape[0].x, y: base_shape[0].y * pit_size}];
    for (var v = 1; v < base_shape.length; v+=2) {
        var sx = v < 2 || v >= base_shape.length - 2 ? base_shape[v].x : base_shape[v].x * pit_size;
        var sy = v < 2 || v >= base_shape.length - 2 ? base_shape[v].y * pit_size : base_shape[v].y * pit_size * 0.8;
        sx = v < base_shape.length / 2 || v >= base_shape.length - 2 ? sx : sx * 0.9;
        pit.push({x: sx, y: sy});
    }

    pit.stroke = color(hue(fill_color), saturation(fill_color), 25);
    pit.fill = fill_color;
    return pit;
}
// cool
