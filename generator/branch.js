// for the branchy layout
function get_branch(spec) {
    // __________
    // \_ __ __ _\
    //   \\ \\ \\
    //  (  (  (   )
    //    v  v  v

    var fill_color = spec.colors.pit;
    var joints = spec.ave_radius < 60 ? 8 : spec.ave_radius < 80 ? 7 : 6;
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
    var branch_width = Math.pow(spec.radius_base, 2) / 300;
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

function get_stem(inside, spec, fill_color) {
    var origin = inside[0];
    var stem_length = 35 + 0.9 * (100 - spec.radius_base);
    var curve = (150 / (100 - stem_length));
    curve = curve > 10 ? 10 : curve;

    // cool let's just enumerate every point, this is fine
    var stem = [
        // bottom
        {x: origin.x - (spec.stem_width / 2), y: origin.y},
        {x: origin.x - (spec.stem_width / 2), y: origin.y},
        // curve
        {x: origin.x - (spec.stem_width + (0.8 * curve)), y: origin.y - (stem_length * 0.65)},
        // top
        {x: origin.x - (spec.stem_width - (0.5 * curve)), y: origin.y - stem_length},
        {x: origin.x - (spec.stem_width - (0.5 * curve)), y: origin.y - stem_length - 3},
        {x: origin.x - (spec.stem_width - (0.5 * curve)), y: origin.y - stem_length - 3},
        {x: origin.x + (spec.stem_width + (0.5 * curve)), y: origin.y - stem_length - 5},
        {x: origin.x + (spec.stem_width + (0.5 * curve)), y: origin.y - stem_length - 5},
        {x: origin.x + (spec.stem_width + (0.5 * curve)), y: origin.y - stem_length},
        // curve
        {x: origin.x + (spec.stem_width - (0.9 * curve)), y: origin.y - (stem_length * 0.65)},
        // bottom
        {x: origin.x + (spec.stem_width * 0.3), y: origin.y - 2},
        {x: origin.x + (spec.stem_width * 0.3), y: origin.y - 2},
    ];

    stem.fill = fill_color;
    stem.stroke = adjust_lightness(fill_color, 0.8);
    stem.strokeWeight = 3;
    return stem;
}

var get_connecting_stem = function(start, end, spec) {
    var bendy = random(-0.05, 0.05);
    var stem = [
        {x: start.x - (spec.stem_width / 2), y : start.y},
        {x: start.x - (spec.stem_width / 2), y : start.y},
        {x: start.x + (spec.stem_width / 2), y: start.y},
        {x: (end.x + start.x) / (2 + bendy) + (spec.stem_width / 2), y: (end.y + start.y) / 2},
        {x: end.x + 2, y: end.y - 2},
        {x: end.x, y: end.y - 2},
        {x: (end.x + start.x) / (2 + bendy) - (spec.stem_width / 2), y: (end.y + start.y) / 2},
    ];
    stem.fill = spec.colors.pit;
    stem.stroke = adjust_lightness(spec.colors.pit, 0.8);
    return stem;
}
