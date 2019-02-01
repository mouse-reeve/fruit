function get_hue(min, max) {
    var base_hue = Math.round(random(min, max)); // magenta through green
    return base_hue % 100;
}

function add_hue(hue, delta) {
    return (hue + delta) % 100;
}
