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
        var jitter = random(radius_base / -20, radius_base / 20);
        return {
            x: 2 * x - point.x + jitter,
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

    var outside = get_outside(base_shape, params);
    var inside = get_inside(outside, params);
    var stem = get_stem(inside);
    var core = get_core(outside, params);
    var pit = get_pit(base_shape, params);
    pit = [pit, get_highlight(pit, '#ffe')];
    var seeds = get_seeds(base_shape, params);
    outside = [outside, get_highlight(outside, '#f99')];

    var whole = [stem, outside];
    var cut = [outside, inside, core, seeds, stem];
    return {cut, whole};
}

function get_outside(base_shape, params) {
    var outside = base_shape.slice(0);

    // add top dip
    for (var i = 0; i < params.top_points.length; i++) {
        outside[params.top_points[i]] = {x: base_shape[0].x, y: base_shape[0].y + (params.radius_y * params.divot_offset)};
    }

    outside.stroke = black;
    outside.fill = '#f00';
    return outside;
}

function get_stem(inside) {
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

    stem.fill = '#ad6a5c';
    stem.stroke = black;
    stem.strokeWeight = 3;
    return stem;
}

function get_highlight(shape, color) {
    var highlight = [];

    var start = 2;
    var end = Math.round(shape.length / 3);
    end = end <= 3 ? 4 : end;
    for (var v = start; v < end; v++) {
        highlight.push({x: shape[v].x * 0.9, y: shape[v].y * 0.9});
    }
    for (var v = end - 2; v >= start; v--) {
        console.log(v);
        highlight.push({x: shape[v].x * 0.7, y: shape[v].y * 0.7});
    }
    highlight.fill = color;

    return highlight;
}

function get_inside(outside, params) {
    // inside
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
    inside.fill = '#f80';
    return inside;
}

function get_core(outside, params) {
    // core
    var core = [];
    var core_size = 0.7;
    for (var v = 0; v < outside.length; v++) {
        var sx = v < 2 || v >= outside.length - 2 ? outside[v].x : outside[v].x * core_size;
        var sy = v < 2 || v >= outside.length - 2 || v == Math.floor(outside.length / 2) ? outside[v].y * 0.99 : outside[v].y * core_size;
        sx = v < outside.length / 2 || v >= outside.length - 2 ? sx : sx * 0.9;
        core.push({x: sx, y: sy});
    }

    // add core top dip
    var divot_offset = params.divot_offset * 2.2;
    for (var i = 0; i < params.top_points.length; i++) {
        core[params.top_points[i]] = {x: outside[0].x, y: outside[0].y + (params.radius_y * divot_offset)};
    }

    core.fill = '#f60';

    return core;
}

function get_seeds(outside, params) {
    var core = [];
    var core_size = 0.2;
    for (var v = 0; v < outside.length; v++) {
        var sx = v < 2 || v >= outside.length - 2 ? outside[v].x : outside[v].x * core_size * 1.2;
        var sy = v < 2 || v >= outside.length - 2 || v == Math.floor(outside.length / 2) ? outside[v].y * 0.8 : outside[v].y * core_size;
        sx = v < outside.length / 2 || v >= outside.length - 2 ? sx : sx * 0.8;
        core.push({x: sx, y: sy});
    }

    // add core top dip
    var divot_offset = params.divot_offset;
    for (var i = 0; i < params.top_points.length; i++) {
        core[params.top_points[i]] = {x: core[0].x, y: core[0].y + (params.radius_y * divot_offset)};
    }

    core.fill = '#f50';

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
        seed.fill = '#f30';
        seed.stroke = '#a20';
        seed.strokeWeight = 2;
        seeds.push(seed);
    }
    return [core, seeds];
}

function get_corner_angle(p1, p2, p3) {
    /*      p1
    /       /|
    /   b /  | a
    /   /A___|
    / p2   c  p3
    */

    var a = get_distance(p3, p1);
    var b = get_distance(p1, p2);
    var c = get_distance(p2, p3);

    return Math.acos(((b ** 2) + (c ** 2) - (a ** 2)) / (2 * b * c));
}

function get_distance(p1, p2) {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}


function get_pit(base_shape, params) {
    // pit
    var pit_size = random(0.3, 0.7);
    var pit = [{x: base_shape[0].x, y: base_shape[0].y * pit_size}];
    for (var v = 1; v < base_shape.length; v+=2) {
        var sx = v < 2 || v >= base_shape.length - 2 ? base_shape[v].x : base_shape[v].x * pit_size;
        var sy = v < 2 || v >= base_shape.length - 2 ? base_shape[v].y * (pit_size) : base_shape[v].y * pit_size * 0.8;
        sx = v < base_shape.length / 2 || v >= base_shape.length - 2 ? sx : sx * 0.9;
        pit.push({x: sx, y: sy});
    }

    pit.stroke = black;
    pit.fill = '#ff0';
    return pit;
}
// cool
