// things that could go in the middle of a fruit

function get_big_seeds(outside, params, fill_color) {
    // like in an apple? "big seeds" is such a weird name for this
    //
    //   /|  |\
    //  (_/  \_)
    var seed = [];
    var scale = random(0.2, 0.3);
    // pointy seed top
    var start = {x: outside[0].x - (params.ave_radius / 15), y: outside[0].y * scale * 0.75};
    seed.push(start, start);

    var halfway = Math.round(outside.length * 0.5) - 1;
    var seed_height = params.radius_base * scale * 0.5;
    // curved seed bottom points
    seed.push({x: outside[halfway - 1].x * scale, y: seed_height});
    seed.push({x: outside[halfway - 4].x * (scale * 0.85), y: seed_height * 0.5});
    seed.push(start, start);

    seed.fill = fill_color;
    seed.stroke = color(hue(fill_color), saturation(fill_color), 25);
    seed.strokeWeight = 2;

    var mirror = seed.map(function (point) {
        return {
            x: -1 * point.x,
            y: point.y,
        };
    });
    for (var i = 2; i < mirror.length - 2; i++) {
        mirror[i].x += random(-0.1 * mirror[i].x, 0.1 * mirror[i].x);
        mirror[i].y += random(-0.1 * mirror[i].y, 0.1 * mirror[i].y);
    }
    mirror.fill = fill_color;
    mirror.stroke = seed.stroke;
    mirror.strokeWeight = 2;
    return random() > 0.6 ? mirror : [seed, mirror];
}

function get_seeds(outside, params, fill_color) {
    // radial seeds, like in a tomato
    //   ( \ / )
    // ( >     < )
    //   ( / \ )
    var seeds = [];
    var radius = get_distance({x: 0, y: 0}, outside[3]) * random(0.05, 0.25);
    // start adding seeds one point in to the shape array
    for (var v = 2; v < outside.length - 3; v++) {
        // skip a point in the middle so there's a gap at the bottom of the
        // fruit with no seed
        if (v == Math.floor(outside.length / 2) - 1) {
            v += 1;
        }
        var seed = [];
        // find a point between the current and next point
        var mx = ((outside[v].x + outside[v + 1].x) / 2) * 0.2;
        var my = ((outside[v].y + outside[v + 1].y) / 2) * 0.2;
        var theta = get_corner_angle(outside[0], {x: 0, y: 0}, outside[v + 1]);
        if (v < (outside.length / 2) - 1) {
            theta = (3 * PI / 2) - theta;
        } else {
            theta = (3 * PI / 2) + theta;
        }
        // the inner pointy tip of the seed
        seed.push({x: mx, y: my});
        seed.push({x: mx, y: my});
        var dist = get_distance({x: 0, y: 0}, {x: mx, y: my});
        // the outside curved points
        seed.push({x: (dist + radius) * cos(theta), y: (dist + radius) * sin(theta)});
        seed.push({x: (dist + radius) * cos(theta + (PI / 12)), y: (dist + radius) * sin(theta + (PI / 12))});

        seed.fill = fill_color;
        seed.stroke = color(hue(fill_color), saturation(fill_color), 25);
        seed.strokeWeight = 2;
        seeds.push(seed);
    }
    return seeds;
}

function get_pit(base_shape, params, fill_color) {
    // like in an apricot or cherry, depending on which coords it skips
    var pit_size = random(0.3, 0.5);
    var pit = [{x: base_shape[0].x, y: base_shape[0].y * pit_size}];
    var pointy = false;
    for (var v = 1; v < base_shape.length; v+=2) {
        var sx, sy;
        if (v < 2 || v >= base_shape.length - 2) {
            // make the top kinda pointy
            sx = base_shape[v].x;
            sy = base_shape[v].y * pit_size;
        } else if (v == Math.round(base_shape.length / 2) - 1) {
            // some bottom pointy (only happens half the time, when there's a point at the very bottom)
            pointy = true;
            sx = base_shape[v].x;
            sy = base_shape[v].y * 0.5;
            pit.push({x: sx - 5, y: sy - 5});
        } else {
            // otherwise we just scale things down, especially on the y axis
            sx = base_shape[v].x * pit_size;
            sy = base_shape[v].y * pit_size * 0.8;
        }
        // this makes the right side a little smaller on the x axis to adjust
        // for the faux 3D effect on the inside cut face
        sx = v < base_shape.length / 2 || v >= base_shape.length - 2 ? sx : sx * 0.9;
        pit.push({x: sx, y: sy});
    }

    pit.stroke = color(hue(fill_color), saturation(fill_color), 25);
    pit.fill = fill_color;

    if (!pointy) {
        var highlight = [];
        start = 1;
        end = Math.ceil(pit.length / 3);
        for (v = start; v <= end; v++) {
            highlight.push({x: pit[v].x * 0.8, y: pit[v].y * 0.8});
        }
        for (v = end; v > start; v--) {
            highlight.push({x: pit[v].x * 0.6, y: pit[v].y * 0.6});
        }
        highlight.fill = color(100, 100, 100, 30);
        return [pit, highlight];
    }

    // shadows for pointy pits
    var shadows = [];
    var offset = params.min_radius / 25;
    var distance = Math.ceil(pit.length * 0.55) - Math.ceil(pit.length / 5);

    var shadow = [];
    var end = pit.length - 2;
    var start = Math.ceil(pit.length / 2);
    var shrink = 0.4;
    for (v = start; v <= end; v++) {
        shadow.push({x: pit[v].x * shrink + offset, y: pit[v].y * shrink});
    }
    shrink -= 0.08;
    for (v = end; v > start; v--) {
        shadow.push({x: pit[v].x * shrink + offset, y: pit[v].y * shrink});
    }
    shadow.fill = color(hue(fill_color), saturation(fill_color), lightness(fill_color) * 0.8);
    shadows.push(shadow);

    for (var i = 0; i < 3; i++) {
        shadow = [];
        start = Math.abs(Math.ceil(pit.length / 5) - i);
        end = start + distance;
        shrink = 0.8 - (i / 5);
        for (v = start; v <= end; v++) {
            shadow.push({x: pit[v].x * shrink + offset, y: pit[v].y * shrink});
        }
        shrink -= 0.08;
        for (v = end; v > start; v--) {
            shadow.push({x: pit[v].x * shrink + offset, y: pit[v].y * shrink});
        }
        shadow.fill = color(hue(fill_color), saturation(fill_color), lightness(fill_color) * 0.8);
        shadows.push(shadow);
    }

    pit = [pit].concat(shadows);
    return pit;
}

