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

function get_leaf(params, branch_color, leaf_color) {
    var len = random(60, 80);
    len *= random(1.7, 2.1);

    // ----- leaf stem
    var stem_length = 10;
    var stem_end = {
        x: 0, y: stem_length
    };
    var stem = [
        {x: 0, y: 0}, {x: 0, y: 0},
        {x: stem_end.x + 2, y: stem_end.y},
        {x: stem_end.x - 2, y: stem_end.y},
    ];
    stem.fill = branch_color;

    // ----- leaf!!!!
    var leaf = [stem_end, stem_end];
    var leaf_points = Math.round(random(2, 6));
    var vein_gap = len / (leaf_points + 1);
    var divot = random([1, random(0.5, 1)]);

    var veins = [stem_end, stem_end];
    var vein_length = random(len / 6, len * 0.6);
    var angle = random(0, PI * 0.2);
    var angle_gap = ((PI * 0.2) - angle) / leaf_points;
    for (var i = 0; i < leaf_points; i++) {
        angle += angle_gap;
        vein_length += (i < leaf_points / 2 ? 1 : -1) * random(4, 10);
        var y_center = stem_end.y + (vein_gap * (i + 1));
        var x_position = vein_length * cos(angle);
        var y_position = y_center + (vein_length * sin(angle));
        // leaf edge point
        if (i > 0 && divot != 1) {
            var divot_x = ((x_position + leaf[leaf.length - 1].x) / 2) * divot;
            var divot_y = (y_position + leaf[leaf.length - 1].y) * 0.45;
            leaf.push({x: divot_x, y: divot_y});
        }
        leaf.push({x: x_position, y: y_position});
        // divot point

        // at the center vein
        veins.push({x: 3, y: y_center});
        veins.push({x: 3, y: y_center});
        // tip of the vein
        veins.push({x: x_position * 0.9, y: y_position});
        // back to the center vein
        veins.push({x: 3, y: y_center + 6});
        veins.push({x: 3, y: y_center + 6});
    }
    var end_y = leaf[leaf.length - 1].y + vein_gap;
    // tippy most tip
    leaf.push({x: stem_end.x, y: end_y});
    veins.push({x: stem_end.x, y: end_y * 0.9});
    var leaf_mirror = leaf.slice(1, -1).map(function (point, idx) {
        return {
            x: -1 * point.x / 2,
            y: point.y
        };
    });
    leaf_mirror.reverse();
    leaf = leaf.concat(leaf_mirror);
    leaf.stroke = adjust_lightness(leaf_color, 0.7);
    leaf.fill = leaf_color;

    var vein_mirror = veins.slice(1).map(function (point) {
        return {
            x: -1 * point.x / 2,
            y: point.y
        };
    });
    vein_mirror.reverse();
    veins = veins.concat(vein_mirror);
    veins.fill = adjust_lightness(leaf_color, 0.8);
    return [stem, leaf, veins];
}
