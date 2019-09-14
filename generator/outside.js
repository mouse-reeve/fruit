// The fruit, whole and uncut

function get_outside(spec) {
    // basically just the base shape with a dip maybe and colors
    var outside = spec.base_shape.slice(0);
    var fill_color = spec.colors.skin;

    // add top dip
    for (var i = 0; i < spec.top_points.length; i++) {
        outside[spec.top_points[i]] = {x: spec.base_shape[0].x, y: spec.base_shape[0].y + (spec.radius_y * spec.divot_offset)};
    }

    // irregularity
    var jitter = spec.ave_radius / 30;
    outside = make_irregular(outside, jitter);

    outside.stroke = adjust_lightness(fill_color, 0.5);
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
