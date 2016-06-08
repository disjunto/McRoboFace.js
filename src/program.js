/**
 * Define LEDs for each column
 *
 * @type {*[]}
 */
var cols = [
    [5],
    [4,9,13],
    [3,8,12],
    [2,7,11],
    [1,6,10],
    [0]
];

/**
 * Define globals required for function
 * @type {number}
 */
var start = 0;
var red = 0;
var green = 0;
var blue = 255;

McRoboFace.run('fade', 'step');
