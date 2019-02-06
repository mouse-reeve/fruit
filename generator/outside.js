// The fruit, whole and uncut

function get_outside(base_shape, params, fill_color) {
    // basically just the base shape with a dip maybe and colors
    var outside = base_shape.slice(0);

    // add top dip
    for (var i = 0; i < params.top_points.length; i++) {
        outside[params.top_points[i]] = {x: base_shape[0].x, y: base_shape[0].y + (params.radius_y * params.divot_offset)};
    }

    outside.stroke = color(hue(fill_color), saturation(fill_color), 25);
    outside.fill = fill_color;
    return outside;
}

function get_highlight(shape) {
    // highlight on the outside to make it look shiiiiiny
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

function get_stem(inside, params, fill_color) {
    var origin = inside[0];
    var stem_length = 35 + 0.9 * (100 - params.radius_base);
    var stem_width = random(0.02, 0.04) * params.radius_y;
    var curve = (150 / (100 - stem_length));

    // cool let's just enumerate every point, this is fine
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

