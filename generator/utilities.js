function get_hue(min, max) {
    var base_hue = Math.round(random(min, max));
    base_hue = base_hue % 100;
    if (base_hue < 0) {
        return 100 + base_hue;
    }
    return base_hue;
}

function add_hue(hue, delta) {
    return (hue + delta) % 100;
}

function adjust_lightness(base_color, ratio) {
    return color(
        hue(base_color),
        saturation(base_color),
        lightness(base_color) * ratio
    );
}

function get_corner_angle(p1, p2, p3) {
    /*      p1
    /       /|
    /   b /  | a
    /   /A___|
    / p2   c  p3
    */

    var a = get_distance(p3, p1);
    var b = get_distance(p1, p2);
    var c = get_distance(p2, p3);

    return Math.acos(
        (Math.pow(b, 2) + Math.pow(c, 2) - Math.pow(a, 2)) / (2 * b * c)
    );
}

function get_distance(p1, p2) {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}
