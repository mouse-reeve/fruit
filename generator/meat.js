function get_cut(outside, spec) {
    var core = get_core(outside, spec, spec.colors.core);
    var center = [core];
    
    if (spec.pit_type == 'segments') {
        var segments = get_segments(outside, spec, spec.colors.core);
        center.push(segments);
    } else if (spec.pit_type == 'pit') {
        var pit = get_pit(outside, spec, spec.colors.pit);
        center.push(pit);
    } else {
        var seeds = get_seeds(outside, spec, spec.colors.pit);
        var big_seeds = get_big_seeds(outside, spec, spec.colors.pit);
        center.push(random([seeds, big_seeds]));
    }
    return center;
}

function get_inside(outside, spec, fill_color) {
    // flesh
    var inside = [];
    for (var v = 0; v < outside.length; v++) {
        var sx = v < outside.length / 2 || v >= outside.length - 2 ? outside[v].x : outside[v].x * 0.9;
        inside.push({x: sx, y: outside[v].y});
    }

    // add inside top dip
    var divot_offset = spec.divot_offset * 1.5;
    for (var i = 0; i < spec.top_points.length; i++) {
        var top_point = spec.top_points[i];
        inside[top_point] = {x: outside[top_point].x, y: outside[top_point].y + (spec.radius_y * divot_offset)};
    }

    inside = inside.slice(0, -2);

    inside.stroke = outside.stroke;
    inside.strokeWeight = 2;
    inside.fill = fill_color;
    return inside;
}


function get_segments(outside, spec, fill_colors) {
    // citrus style, or big seeds? could be either
    var shrink = 0.85;

    var start = {x: spec.radius_base / -6, y: spec.radius_base / 20};
    var segment = [start, start];
    // skipping every other coord gives it a rounder shape (see, pit)
    for (var v = 1; v < Math.ceil(outside.length / 2) + 1; v += 2) {
        var local_shrink_x = v == 1 || v == Math.round(outside.length / 2) ? shrink * 0.9 : shrink;
        var local_shrink_y = v == 1 || v == Math.round(outside.length / 2) ? shrink * 0.8 : shrink;
        var sx = outside[v].x * local_shrink_x;
        sx = sx > -5 ? -10 : sx;
        var sy = outside[v].y * local_shrink_y;
        segment.push({x: sx, y: sy});
    }
    var stroke_color = adjust_lightness(fill_colors[0], 0.8);
    segment.stroke = stroke_color;
    segment.fill = fill_colors[0];

    var shading = [start, start];
    shrink = 0.6;
    // starburst shape for the dark color
    for (v = 1; v < Math.floor(outside.length / 2) - 1; v++) {
        var sx = outside[v].x * shrink;
        sx = sx > -5 ? -10 : sx;
        var sy = outside[v].y * shrink;
        shading.push({x: sx, y: sy});
        if (v + 1 >= outside.length / 2 - 1) {
            shading.push({x: sx * 0.4, y: sy * 0.4});
        } else {
            shading.push({x: (sx + outside[v + 1].x) * 0.2, y: (sy + outside[v + 1].y) * 0.2});
        }
    }
    shading.fill = fill_colors[1];

    // 0.9 for the shrinkage on the right side due to janky 3d effect
    var mirror = segment.map(function (point) {
        return {
            x: -0.9 * point.x,
            y: point.y,
        };
    });

    var shading_mirror = shading.map(function (point) {
        return {
            x: -0.9 * point.x,
            y: point.y,
        };
    });
    shading_mirror.fill = fill_colors[1];

    mirror.stroke = stroke_color;
    mirror.fill = fill_colors[0];

    return [segment, shading, mirror, shading_mirror];
}

function get_core(outside, spec, fill_color) {
    // darker colors on the inside to give it a sense of core
    var cores = [[], []];
    var core_size = 0.7;
    for (var v = 0; v < outside.length; v++) {
        var sx = v < 2 || v >= outside.length - 2 ? outside[v].x : outside[v].x * core_size;
        var sy = v < 2 || v >= outside.length - 2 || v == Math.floor(outside.length / 2) ? outside[v].y * 0.99 : outside[v].y * core_size;
        sx = v < outside.length / 2 || v >= outside.length - 2 ? sx : sx * 0.9;
        cores[0].push({x: sx, y: sy});
    }

    var divot_offset = spec.divot_offset * 2.2;
    for (var i = 0; i < spec.top_points.length; i++) {
        cores[0][spec.top_points[i]] = {x: outside[0].x, y: outside[0].y + (spec.radius_y * divot_offset)};
    }

    cores[0].fill = fill_color[0];

    // CORE PART TWO, probably could be generalized because this is hecka
    // repetative but OH WELL
    core_size = 0.2;
    for (v = 0; v < outside.length; v++) {
        var cx = v < 2 || v >= outside.length - 2 ? outside[v].x : outside[v].x * core_size * 1.2;
        var cy = v < 2 || v >= outside.length - 2 || v == Math.floor(outside.length / 2) ? outside[v].y * 0.8 : outside[v].y * core_size;
        cx = v < outside.length / 2 || v >= outside.length - 2 ? cx : cx * 0.8;
        cores[1].push({x: cx, y: cy});
    }

    divot_offset = spec.divot_offset;
    for (i = 0; i < spec.top_points.length; i++) {
        cores[1][spec.top_points[i]] = {x: cores[1][0].x, y: cores[1][0].y + (spec.radius_y * divot_offset)};
    }

    cores[1].fill = fill_color[1];
    return cores;
}

