// A crosswise slice

function get_crosswise(outside, params, fill_colors) {
    var point_count = random(20, 50);
    var outer = [];
    var radius = params.max_radius * 0.8;
    var i = 0;
    var initial_radius = radius;
    for (var a = PI; a < 1.5 * TWO_PI; a += TWO_PI / point_count) {
        if (i > point_count - 3) {
            radius = (radius + initial_radius) / 2;
        }
        var y_offset = 1;//a > PI ? 0.9 : 1;
        outer.push({x: radius * cos(a), y: radius * sin(a) * y_offset});
        var perterbation = i % 4 ? 1 : random(0.95, 1.03);
        radius = radius * perterbation;
        i++;
    }
    outer.splice(0, 0, outer[0]);
    outer.fill = fill_colors[0];
    outer.stroke = color(hue(fill_colors[0]), saturation(fill_colors[0]), lightness(fill_colors[0]) * 0.4);

    var skin = outer.map(function(point, idx) {
        var x_shift = idx > outer.length * 0.25 && idx < outer.length * 0.75 ? 1.13 : 1;
        x_shift *= x_shift == 1 ? 1 : random(1, 1.01);
        return {x: point.x * x_shift, y: point.y};
    });
    skin.fill = outside.fill;
    skin.stroke = outside.stroke;

    var cores = [];
    var offsets = [
        [0.7, 0.8],
        [0.3, 0.6]
    ];
    for (var c = 1; c < fill_colors.length; c++) {
        var core = [];
        var jump = 2;
        for (var j = 0; j < outer.length; j += jump) {
            var offset = (j % (2 * jump) ? offsets[c - 1][1] : offsets[c - 1][0]) * (1 / c);
            core.push({x: outer[j].x * offset, y: outer[j].y * offset});
        }
        core.fill = fill_colors[c];
        cores.push(core);
    }

    return [skin, outer, cores];
}

function get_cross_seeds(crosswise, fill_color) {
    //   (_\  /_)
    //
    // ( >     < )
    //    _   _
    //   ( /  \ )
    var seeds = [];
    var radius = Math.abs(crosswise[0].x) * 0.4;
    var inset_radius = radius * random(0.2, 0.8);
    var seed_count = Math.round(random(5, 10));
    var angle = TWO_PI / seed_count * 0.3;
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

        seed.fill = fill_color;
        seed.stroke = adjust_lightness(fill_color, 0.8);
        seed.strokeWeight = 2;
        seeds.push(seed);
    }
    return seeds;
}

