// for the branchy layout
function get_branch(params, fill_color) {
    // __________
    // \_ __ __ _\
    //   \\ \\ \\
    //  (  (  (   )
    //    v  v  v

    var joints = params.ave_radius < 60 ? 8 : params.ave_radius < 80 ? 7 : 5;
    var segment_length = paper_width / (joints + 1);
    var theta = PI / 5;

    // fruit stems will attach at each joint, and we want fewer fruits if they are bigger
    var start = joints < 9 ? {x: paper_width / 5, y: paper_width / 6} : {x: paper_width / 6, y: paper_width / 6};
    start = {x: paper_width / (joints - 2.5), y: paper_width / 6.5};
    var branch = [start, start];
    for (var i = 2; i < joints; i++) {
        var actual_length = segment_length + random(-10, 10);
        // adds small amount of curviness
        theta -= PI / 35;
        var sx = branch[i - 1].x + (actual_length * cos(theta));
        var sy = branch[i - 1].y + (actual_length * sin(theta));
        branch.push({x: sx, y: sy});
    }

    // thicker branches for larger fruits
    var branch_width = Math.pow(params.radius_base, 2) / 500;
    var reversed = branch.slice(1).map(function(point) {
        return {x: point.x + branch_width * cos(5 * PI / 3), y: point.y + branch_width * sin(5 * PI / 3)};
    });

    reversed.push({
        x: reversed[reversed.length - 1].x + 10,
        y: reversed[reversed.length - 1].y + 10
    });
    reversed.reverse();
    branch = branch.concat(reversed);

    branch.stroke = adjust_lightness(fill_color, 0.8);
    branch.fill = fill_color;

    var cut = [
        start, start,
        {x: branch.slice(-1)[0].x - (branch_width / 2), y: branch.slice(-1)[0].y + (branch_width / 4)},
        branch.slice(-1)[0],
        {x: branch.slice(-1)[0].x + (branch_width / 4), y: branch.slice(-1)[0].y + (branch_width / 2)},
    ];
    cut.fill = adjust_lightness(fill_color, 1.4);
    cut.stroke = adjust_lightness(fill_color, 0.8);

    // highlight
    var midline = [start, start];
    for (var j = 2; j < branch.length; j++) {
        var y_offset = branch_width * 0.4 * (j <= Math.round(branch.length / 2) ? -1 : 1);
        if (j == Math.round(branch.length / 2))  {
            y_offset = 0;
        }
        var x_offset = j == Math.round(branch.length / 2) ? -5 : 0;
        var mid_x = (branch[j - 1].x + branch[j].x) / 2;
        var mid_y = (branch[j - 1].y + branch[j].y) / 2;
        if (j != Math.round(branch.length / 2) && j != Math.round(branch.length / 2) + 1) {
            midline.push({x: mid_x + x_offset, y: (mid_y + y_offset) * random(0.99, 1.01)});
        }
        midline.push({x: branch[j].x + x_offset, y: branch[j].y + y_offset});
    }
    midline.fill = adjust_lightness(fill_color, 0.8);

    return [branch, midline, cut];
}

function get_stem(inside, params, fill_color) {
    var origin = inside[0];
    var stem_length = 35 + 0.9 * (100 - params.radius_base);
    var stem_width = random(0.02, 0.04) * params.radius_y;
    var curve = (150 / (100 - stem_length));
    curve = curve > 10 ? 10 : curve;

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
    stem.stroke = adjust_lightness(fill_color, 0.8);
    stem.strokeWeight = 3;
    return stem;
}

function get_leaf(params) {
    var len = params.radius_y > 60 ? params.radius_y : 60;
    len *= random(0.7, 1.1);
    // leaf stem
    var stem = [];
    var stem_length = 20;
    stem.push({x: 0, y: 0});
    stem.push({x: 0, y: 0});
    var stem_origin = {
        x: 0, y: stem_length
    };
    stem.push({
        x: stem_origin.x + 2, y: stem_origin.y
    });
    stem.push({
        x: stem_origin.x + 2, y: stem_origin.y
    });
    stem.push({x: stem_origin.x - 2, y: stem_origin.y});
    stem.push({x: stem_origin.x - 2, y: stem_origin.y});
    stem.fill = black;

    var leaf = [stem_origin, stem_origin];
    // an even number
    var point_count = 2 * Math.round(random(2, 2));
    var radii = [];
    for (var i = 0; i <= point_count / 2; i++) {
        var rad = i > 0 ? radii[i - 1] : len;
        radii.push(rad * random(1, 1.3));
    }
    var mirror = radii.slice(0, -1);
    mirror.reverse();
    radii = radii.concat(mirror);

    var divot = random([0.6, random(0.6, 1)]);

    var arc_length = random(PI * 0.2, PI * 1.9);
    var gap = arc_length / point_count;
    var arc_start = 3 * HALF_PI + (TWO_PI - arc_length) / 2;
    var leaf_side = [];
    var c = 0;
    var leaf_origin = {
        x: stem_origin.x,
        y: stem_origin.y + (len * random([0.5, random(0, 0.5)]))
    };
    for (var a = arc_start; a < arc_start + arc_length + 0.1; a += gap) {
        if (c > 0) {
            // pointy leafs mode
            var local_rad = (radii[c] + radii[c - 1]) / 2;
            leaf.push({
                x: leaf_origin.x + (local_rad  * divot * cos(a - gap / 2)),
                y: leaf_origin.y + (local_rad * divot * sin(a - gap / 2))
            });
        }
        leaf.push({
            x: leaf_origin.x + (radii[c] * cos(a)),
            y: leaf_origin.y + (radii[c] * sin(a))
        });
        c += 1;
    }
    leaf.fill = color(random(15, 20), random(20, 30), random(50, 60), 100);
    leaf.stroke = adjust_lightness(leaf.fill, 0.4);

    return [stem, leaf];
}
