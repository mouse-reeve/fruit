function create_fruit() {
    var x = 0;
    var y = 0;

    var radius_base = random(50, 110);
    var radius_y = radius_base;
    var radius_x = radius_base;
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

    var params = {
        divot_offset: random(0, 0.2),
        radius_base: radius_base,
        radius_y: radius_y,
        ave_radius: ave_radius,
        top_points: [0, 1, base_shape.length - 2, base_shape.length - 1],
        min_radius: min_radius,
    };

    // --- palette
    var skin_color = color(
        get_hue(-5, 40),
        random(55, 100),
        random(10, 80),
        100
    );
    var flesh_color = color(
        get_hue(0, 15),
        random(90, 100),
        random(50, 95),
        100
    );
    var outside = get_outside(base_shape, params, skin_color);
    var inside = get_inside(outside, params, flesh_color);
    var stem = get_stem(inside, params, color(10, 65, 40));

    var core_colors = [
        color(
            add_hue(hue(flesh_color), random(-1, -5)),
            saturation(flesh_color),
            lightness(flesh_color) - random(8, 18),
            100
        )
    ];
    core_colors.push(
        color(
            hue(core_colors[0]),
            saturation(core_colors[0]),
            lightness(core_colors[0]) - 7,
            100
        )
    );

    var pit_color = color(10, 65, random(30, 60));

    var pit_type;
    if (params.divot_offset > 0.07) {
        pit_type = random(['pit', 'seed']);
    } else {
        pit_type = random([
            'pit', 'pit', 'pit',
            'seed', 'seed', 'seed',
            'segments',
        ]);
    }
    var core = get_core(outside, params, core_colors);
    var center = [core];
    if (min_radius < radius_base / 5) {
        pit_type = 'pit';
    }

    if (pit_type == 'segments') {
        var segments = get_segments(outside, params, core_colors);
        core_colors = core_colors.map(function(color_item) {
            return color(hue(color_item), saturation(color_item), lightness(color_item) + 5);
        });
        core = get_core(outside, params, core_colors);
        center = [core, segments];
    } else if (pit_type == 'pit') {
        var pit = get_pit(outside, params, pit_color);
        center.push(pit);
    } else {
        var seeds = get_seeds(base_shape, params, pit_color);
        var big_seeds = get_big_seeds(outside, params, pit_color);
        center.push(random([seeds, big_seeds]));
    }

    var branch = get_branch(params, pit_color);

    outside = [outside, get_highlight(outside)];
    var fruit = {
        branch: branch,
        whole: [stem, outside],
        cut: [outside, stem, inside, center],
    };

    var tip = stem[4];
    fruit.tip = tip;
    fruit.radius_base = radius_base;
    fruit.ave_radius = ave_radius;
    fruit.pit_type = pit_type;
    return fruit;
}

// cool
