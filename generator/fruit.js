function get_spec_fruit() {
    var x = y = 0;

    var radius_base = random(30, 110);
    var radius_y = radius_x = radius_base;
    var perturbation_y = radius_base / 9;
    var perturbation_x = radius_base / 6;
    var point_count = Math.round(random(6, 8));
    var angle = PI / point_count;

    var start = {x: x, y: y - radius_y};

    var base_shape = [];
    // idk why the first point goes in twice but it does?
    base_shape.push(start);
    base_shape.push(start);
    var min_radius;
    var max_radius_x;
    var ave_radius = 0;
    var rad_count = 0;
    // create the first side
    for (var a = HALF_PI + angle; a <= 3 * HALF_PI; a += angle) {
        radius_x += Math.round(random(-1 * perturbation_x, 0.7 * perturbation_x));
        radius_x = radius_x < 0 ? perturbation_x : radius_x;
        // keep track of the minimum radius to decide if seeds will fit
        if (!min_radius || radius_x < min_radius) {
            min_radius = radius_x;
        }
        if (!max_radius_x || radius_x > max_radius_x) {
            max_radius_x = radius_x;
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

    // --- palette
    var skin_color = color(
        get_hue(-5, 40),
        random(55, 100),
        random(10, 80),
        100
    );
    var flesh_color = color(
        get_hue(5, 15),
        random(90, 100),
        random(50, 95),
        100
    );

    var pit_type;
    var divot_offset = random(0, 0.2);
    if (min_radius < radius_base / 5) {
        pit_type = 'pit';
    }
    else if (divot_offset > 0.07) {
        pit_type = random(['pit', 'seed']);
    } else {
        pit_type = random([
            'pit',
            'seed',
            'segments',
        ]);
    }
    var core_colors = [
        adjust_lightness(color(
            add_hue(hue(flesh_color), random([-2, 1]) * random(2, 5)),
            saturation(flesh_color),
            lightness(flesh_color),
            100
        ), random(0.8, 1.2))
    ];
    core_colors.push(adjust_lightness(core_colors[0], 0.9));

    var pit_color = color(10, 65, random(30, 60));
    return {
        base_shape: base_shape,
        divot_offset: divot_offset,
        radius_base: radius_base,
        radius_y: radius_y,
        ave_radius: ave_radius,
        top_points: [0, 1, base_shape.length - 2, base_shape.length - 1],
        min_radius: min_radius,
        max_radius: max_radius_x,
        colors: {
            skin: skin_color,
            flesh: flesh_color,
            core: core_colors,
            pit: pit_color,
        },
        pit_type: pit_type,
    };
}

var get_actual_fruit = function (spec) {
    var outside = get_outside(spec);
    var highlight = get_highlight(outside);
    var inside = get_inside(outside, spec, spec.colors.flesh);
    var cut = get_cut(outside, spec);
    var stem = get_stem(inside, spec, spec.colors.pit);
    return {
        outside: [stem, outside, highlight],
        cut: [outside, inside, cut, stem],
    };
}

// cool
