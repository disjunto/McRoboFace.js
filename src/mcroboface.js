var leds = [];
var NUM_LEDS = 17;

McRoboFace = {
    init: function () {
        for (i = 0; i < 17; i++) {
            this.setLed(i, 0, 0, 0);
        }
        this.show();
    },
    setLed: function (led, red, green, blue) {
        leds[led] = {
            red: red,
            green: green,
            blue: blue
        }
    },
    run: function (program, method) {
        jQuery.get("src/" + program + "/" + program + ".ino").success(function(data) {
            // Get start of code block based on method name
            var startChr = data.indexOf("void " + method + "()");
            var code = data.substr(startChr);
            var tmpCode;

            // Find end of code block by comparing counts of opening + closing brackets
            var cutOff = 0;
            var offset = 0;
            do {
                cutOff++;
                offset += code.indexOf('}') + 1
                tmpCode = code.substr(0, offset);

                var open = tmpCode.match(/{/g).length;
                var close = tmpCode.match(/}/g).length;
            } while (close != open);

            // Replace void with function
            tmpCode = tmpCode.replace("void " + method + "()", "(function()");

            // Replace int/char with var
            code = tmpCode.replace(/(int|char)/g, "var") + ")();";

            // Honest, this is safe
            eval(code);
        });
    },
    show: function () {
        FastLED.show();
    }
};

FastLED = {
    show: function () {
        leds.forEach(function (rgb, led) {
            var id = "#led-" + led;
            var bg = "rgb(" + rgb.red + "," + rgb.green + "," + rgb.blue + ")";

            $(id).css('background-color', bg);
        });
    }
};

/**
 * Imitate FastLED CRGB definition that is out of order
 *
 * @param green
 * @param red
 * @param blue
 */
CRGB = function (green, red, blue) {
    return {
        red: red,
        green: green,
        blue: blue
    }
};

/**
 * Simulate a delay call after step completion
 *
 * @param time
 */
delay = function (time) {
    var method = arguments.callee.caller;
    window.setTimeout(function () {
        method();
    }, time);
};

McRoboFace.init();

