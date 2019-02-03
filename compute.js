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
    outside = [outside, get_highlight(outside)];

    var center = min_radius < radius_base / 5 ? pit : random([seeds, pit]);

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

function get_branch(params, fill_color) {
    var joints = params.ave_radius < 60 ? 8 : params.ave_radius < 80 ? 7 : 5;
    var segment_length = width / (joints + 1);
    var theta = PI / 5;

    var start = joints < 9 ? {x: width / 5, y: width / 6} : {x: width / 6, y: width / 6};
    start = {x: width / (joints - 2.5), y: width / 6.5};
    var branch = [start, start];
    for (var i = 2; i < joints; i++) {
        var actual_length = segment_length + random(-10, 10);
        theta -= PI / 35;
        var sx = branch[i - 1].x + (actual_length * cos(theta));
        var sy = branch[i - 1].y + (actual_length * sin(theta));
        branch.push({x: sx, y: sy});
    }

    var branch_width = Math.pow(params.radius_base, 2) / 500;
    reverse = branch.slice(1).map(function(point) {
        return {x: point.x + branch_width * cos(5 * PI / 3), y: point.y + branch_width * sin(5 * PI / 3)};
    });

    reverse.push({
        x: reverse[reverse.length - 1].x + 10,
        y: reverse[reverse.length - 1].y + 10
    });
    reverse.reverse();
    branch = branch.concat(reverse);

    branch.stroke = color(hue(fill_color), saturation(fill_color), 25);
    branch.fill = fill_color;
    return branch;
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

function get_seeds(outside, params, fill_color) {
    var seeds = [];
    var radius = get_distance({x: 0, y: 0}, outside[3]) * random(0.05, 0.25);
    for (var v = 2; v < outside.length - 3; v++) {
        if (v == Math.floor(outside.length / 2) - 1) {
            v += 1;
        }
        var seed = [];
        var p1 = outside[v];
        var p2 = outside[v + 1];
        var mx = ((p1.x + p2.x) / 2) * 0.2;
        var my = ((p1.y + p2.y) / 2) * 0.2;
        var theta = get_corner_angle(outside[0], {x: 0, y: 0}, p2);
        if (v < (outside.length / 2) - 1) {
            theta = (3 * PI / 2) - theta;
        } else {
            theta = (3 * PI / 2) + theta;
        }
        seed.push({x: mx, y: my});
        seed.push({x: mx, y: my});
        var dist = get_distance({x: 0, y: 0}, {x: mx, y: my});
        seed.push({x: (dist + radius) * cos(theta), y: (dist + radius) * sin(theta)});
        seed.push({x: (dist + radius) * cos(theta + (PI / 12)), y: (dist + radius) * sin(theta + (PI / 12))});
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
