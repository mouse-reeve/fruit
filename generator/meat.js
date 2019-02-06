// MEEEAAAAAT or maybe FLEEEESSSSHHH

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
    // darker colors on the inside to give it a sense of core
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

    // CORE PART TWO, probably could be generalized because this is hecka
    // repetative but OH WELL
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

