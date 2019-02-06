function create_fruit() {
    var x = 0;
    var y = 0;

    var radius_base = random(50, 110);
    var radius_y = radius_base;
    var radius_x = radius_base;
    var perturbation_y = radius_base / 10;
    var perturbation_x = radius_base / 4;
    var point_count = Math.round(random(6, 8));
    var angle = PI / point_count;

    var start = {x: x, y: y - radius_y};

    var base_shape = [];
    // idk why the first point goes in twice but it does?
    base_shape.push(start);
    base_shape.push(start);
    var min_radius;
    var ave_radius = 0;
    var rad_count = 0;
    // create the first side
    for (var a = HALF_PI + angle; a <= 3 * HALF_PI; a += angle) {
        radius_x += Math.round(random(-1 * perturbation_x, perturbation_x));
        radius_x = radius_x < 0 ? perturbation_x : radius_x;
        // keep track of the minimum radius to decide if seeds will fit
        if (!min_radius || radius_x < min_radius) {
            min_radius = radius_x;
        }
        radius_y += Math.round(random(-1 * perturbation_y, perturbation_y));
        radius_y = radius_y < 0 ? perturbation_y : radius_y;
        rad_count+=2;
        ave_radius += radius_x + radius_y;
        var sx = x + cos(a) * radius_x;
        var sy = y - sin(a) * radius_y;
        base_shape.push({x: sx, y: sy});
    }

    ave_radius = ave_radius / rad_count;

    // mirror side a
    var reversed = base_shape.map(function (point) {
        return {
            x: (2 * x) - point.x,
            y: point.y,
        };
    });
    for (var i = 3; i < reversed.length; i++) {
        var jitter = random(radius_base / -30, radius_base / 30);
        reversed[i] = {x: reversed[i].x + jitter, y: reversed[i].y + jitter};
    }
    reversed.reverse();
    base_shape = base_shape.concat(reversed.slice(1));

    var params = {
        divot_offset: random(0, 0.2),
        radius_base: radius_base,
        radius_y: radius_y,
        ave_radius: ave_radius,
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
    var stem = get_stem(inside, params, color(10, 65, 40));

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
    var big_seeds = get_big_seeds(outside, params, pit_color);
    outside = [outside, get_highlight(outside)];

    var center = [pit, big_seeds];//min_radius < radius_base / 5 ? pit : random([seeds, pit]);
    if (min_radius > radius_base / 5) {
        center.push(seeds);
    }
    center = random(center);

    var branch = get_branch(params, pit_color);
    var fruit = {
        branch: branch,
        whole: [stem, outside],
        cut: [outside, stem, inside, core, center],
    };

    var tip = stem[4];
    fruit.tip = tip;
    fruit.radius_base = radius_base;
    fruit.ave_radius = ave_radius;
    return fruit;
}

function get_outside(base_shape, params, fill_color) {
    var outside = base_shape.slice(0);

    // add top dip
    for (var i = 0; i < params.top_points.length; i++) {
        outside[params.top_points[i]] = {x: base_shape[0].x, y: base_shape[0].y + (params.radius_y * params.divot_offset)};
    }

    outside.stroke = color(hue(fill_color), saturation(fill_color), 25);
    outside.fill = fill_color;
    return outside;
}

function get_stem(inside, params, fill_color) {
    var origin = inside[0];
    var stem_length = 35 + 0.9 * (100 - params.radius_base);
    var stem_width = random(0.02, 0.04) * params.radius_y;
    var curve = (150 / (100 - stem_length));

    var stem = [
        // bottom
        {x: origin.x - (stem_width / 2), y: origin.y},
        {x: origin.x - (stem_width / 2), y: origin.y},
        // curve
        {x: origin.x - (stem_width + (0.8 * curve)), y: origin.y - (stem_length * 0.65)},
        // top
        {x: origin.x - (stem_width - (0.5 * curve)), y: origin.y - stem_length},
        {x: origin.x - (stem_width - (0.5 * curve)), y: origin.y - stem_length - 3},
        {x: origin.x - (stem_width - (0.5 * curve)), y: origin.y - stem_length - 3},
        {x: origin.x + (stem_width + (0.5 * curve)), y: origin.y - stem_length - 5},
        {x: origin.x + (stem_width + (0.5 * curve)), y: origin.y - stem_length - 5},
        {x: origin.x + (stem_width + (0.5 * curve)), y: origin.y - stem_length},
        // curve
        {x: origin.x + (stem_width - (0.9 * curve)), y: origin.y - (stem_length * 0.65)},
        // bottom
        {x: origin.x + (stem_width * 0.3), y: origin.y - 2},
        {x: origin.x + (stem_width * 0.3), y: origin.y - 2},
    ];

    stem.fill = fill_color;
    stem.stroke = color(hue(fill_color), saturation(fill_color), 25);
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
    for (v = end - 2; v >= start; v--) {
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
        var top_point = params.top_points[i];
        inside[top_point] = {x: outside[top_point].x, y: outside[top_point].y + (params.radius_y * divot_offset)};
    }

    inside = inside.slice(0, -2);

    inside.stroke = color(hue(fill_color), saturation(fill_color), 25);
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
    for (v = 0; v < outside.length; v++) {
        var cx = v < 2 || v >= outside.length - 2 ? outside[v].x : outside[v].x * core_size * 1.2;
        var cy = v < 2 || v >= outside.length - 2 || v == Math.floor(outside.length / 2) ? outside[v].y * 0.8 : outside[v].y * core_size;
        cx = v < outside.length / 2 || v >= outside.length - 2 ? cx : cx * 0.8;
        cores[1].push({x: cx, y: cy});
    }

    divot_offset = params.divot_offset;
    for (i = 0; i < params.top_points.length; i++) {
        cores[1][params.top_points[i]] = {x: cores[1][0].x, y: cores[1][0].y + (params.radius_y * divot_offset)};
    }

    cores[1].fill = fill_color[1];
    return cores;
}
// cool
