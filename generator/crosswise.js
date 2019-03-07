// A crosswise slice

function get_crosswise(outside, params, fill_color) {
    var point_count = random(20, 50);
    var outer = [];
    var radius = params.max_radius * 0.8;
    var i = 0;
    var initial_radius = radius;
    for (var a = PI; a < 3 * PI; a += TWO_PI / point_count) {
        if (i > point_count - 3) {
            radius = (radius + initial_radius) / 2;
        }
        var y_offset = 1;//a > PI ? 0.9 : 1;
        outer.push({x: radius * cos(a), y: radius * sin(a) * y_offset});
        var perterbation = i % 4 ? 1 : random(0.97, 1.03);
        radius = radius * perterbation;
        i++;
    }
    outer.splice(0, 0, outer[0]);
    outer.fill = fill_color;
    outer.stroke = adjust_lightness(fill_color, 0.4);

    var skin = outer.map(function(point, idx) {
        var x_shift = idx > outer.length * 0.25 && idx < outer.length * 0.75 ? 1.13 : 1;
        x_shift *= x_shift == 1 ? 1 : random(1, 1.01);
        return {x: point.x * x_shift, y: point.y};
    });
    skin.fill = outside.fill;
    skin.stroke = outside.stroke;

    return [skin, outer];
}

function get_cross_seeds(crosswise, core_colors, seed_color) {
    //   (_\  /_)
    //
    // ( >     < )
    //    _   _
    //   ( /  \ )

    // first some core fanciness
    var cores = get_cross_cores(crosswise, 0, core_colors);
    var seeds = [];
    var radius = Math.abs(crosswise[0].x) * 0.4;
    var inset_radius = radius * random(0.2, 0.8);
    var seed_count = Math.round(random(5, 10));
    var angle = radius / random(100, 150);
    var gap = TWO_PI / seed_count;

    // start adding seeds one point in to the shape array
    for (var theta = 0; theta < TWO_PI; theta += gap) {
        var local_radius = radius * random(0.92, 1.08);
        var local_inset = inset_radius * random(0.95, 1.05);
        var local_angle = angle * random(0.93, 1.07);
        var start = {x: local_inset * cos(theta), y: local_inset * sin(theta)};
        var seed = [
            // pointy center tip
            start, start,
            // the outside curved points
            {x: local_radius * cos(theta + (local_angle / 2)), y: local_radius * sin(theta + (local_angle / 2))},
            {x: local_radius * cos(theta - (local_angle / 2)), y: local_radius * sin(theta - (local_angle / 2))},
        ];

        seed.fill = seed_color;
        seed.stroke = adjust_lightness(seed_color, 0.8);
        seed.strokeWeight = 2;
        seeds.push(seed);
    }
    return [cores, seeds];
}

function get_cross_segments(crosswise, fill_colors) {
    //  (_\/_)
    // ( >  < )
    //  ( /\ )

    var cores = get_cross_cores(crosswise, 1, fill_colors);
    var segments = [];
    var inset_radius = Math.abs(crosswise[0].x * random(0.05, 0.3));
    var segment_count = Math.round(random(6, 10));
    var gap = TWO_PI / segment_count;
    var angle = gap * 0.8;
    var radius_ratio = random(0.6, 0.95);

    var current_segment = 2;
    // the - 0.01 bti stops if from duplicating a segment, not sure why
    for (var theta = PI; theta < 3 * PI - 0.01; theta += gap) {
        var local_radius = get_distance(crosswise[current_segment], {x: 0, y: 0}) * radius_ratio;
        current_segment += Math.floor(crosswise.length / segment_count);
        var local_inset = inset_radius;
        var local_angle = angle;
        var start = {x: local_inset * cos(theta), y: local_inset * sin(theta)};
        var segment = [
            // less pointy center tip
            start, start,
            {x: local_inset * cos(theta + (local_angle / 4)), y: local_inset * sin(theta + (local_angle / 4))},
            // the outside curved points
            {x: local_radius * 0.9  * cos(theta + (local_angle / 2)), y: local_radius * 0.9 * sin(theta + (local_angle / 2))},
            {x: local_radius * cos(theta), y: local_radius * sin(theta)},
            {x: local_radius * 0.9 * cos(theta - (local_angle / 2)), y: local_radius * 0.9 * sin(theta - (local_angle / 2))},
            // less pointy center again
            {x: local_inset * cos(theta - (local_angle / 4)), y: local_inset * sin(theta - (local_angle / 4))},
        ];
        segment.fill = fill_colors[0];
        segment.stroke = adjust_lightness(fill_colors[0], 0.6);
        segment.strokeWeight = 2;

        var detail = [
            // pointy center tip
            start, start,
            // the outside curved points
            {x: local_radius * 0.7  * cos(theta + (local_angle / 3)), y: local_radius * 0.7 * sin(theta + (local_angle / 3))},
            {x: local_radius * 0.5  * cos(theta), y: local_radius * 0.5 * sin(theta)},
            {x: local_radius * 0.7 * cos(theta - (local_angle / 3)), y: local_radius * 0.7 * sin(theta - (local_angle / 3))},
        ];
        detail.fill = adjust_lightness(fill_colors[0], 0.9);
        segments.push([segment, detail]);
    }
    return [cores, segments];
}

function get_cross_cores(outer, start_count, core_colors) {
    // some core fanciness
    var cores = [];
    var offsets = [
        [0.7, 0.8],
        [0.3, 0.6]
    ];
    for (var c = start_count; c < core_colors.length; c++) {
        var core = [];
        var jump = 2;
        for (var j = 0; j < outer.length; j += jump) {
            var offset = (j % (2 * jump) ? offsets[c][1] : offsets[c][0]) * (1 / (c + 1));
            core.push({x: outer[j].x * offset, y: outer[j].y * offset});
        }
        core.fill = core_colors[c];
        cores.push(core);
    }
    return cores;
}
