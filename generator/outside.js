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

function get_ridges(outside, spec) {
    var left = outside.slice(2, Math.floor(outside.length / 2));
    var right = outside.slice(Math.floor(outside.length / 2), -2);
    right.reverse()
    var ridges = [];
    for (var i = 0.05; i <= 1; i += 0.22) {
        var ridge = [];
        for (var j = 0; j < left.length; j++) {
            ridge.push({
                x: (left[j].x * (1 - i)) + (right[j].x * i),
                y: ((left[j].y * (1 - i)) + (right[j].y * i)) * (j > 0 ? 1 : 0.9),
            });
        }
        ridge = make_irregular(ridge, spec.ave_radius / 20);
        for (var j = ridge.length - 1; j >= 0; j--) {
            ridge.push({
                x: ridge[j].x - ((spec.ave_radius / 5) / (2 + (Math.abs(ridge.length - (2 * (j + 2)))))),
                y: ridge[j].y
            });
        }
        ridge.fill = adjust_lightness(spec.colors.skin, 0.7);
        ridges.push(ridge);

        if (i > 0.65) {
            continue;
        }
        // small highlights
        var y_pos = left[0].y * ((0.5 - i) ** 2);
        var x_pos = ridge[3].x + (spec.ave_radius / 8);
        var highlight = [
            {x: x_pos, y: y_pos},
            {x: x_pos - 5, y: y_pos + 10},
            {x: x_pos, y: y_pos + 20},
            {x: x_pos + 5 * (1 - i), y: y_pos + 10},
        ];
        highlight.fill = adjust_lightness(spec.colors.skin, 1.5);
        ridges.push(highlight);
    }
    return ridges;
}

