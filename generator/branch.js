// for the branchy layout
function get_branch(params, fill_color) {
    // __________
    // \____ ____\
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

    branch.stroke = color(hue(fill_color), saturation(fill_color), 25);
    branch.fill = fill_color;
    return branch;
}

