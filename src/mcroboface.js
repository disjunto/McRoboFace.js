var leds = [];
var NUM_LEDS = 17;

McRoboFace = {
    program: "",
    init: function () {
        for (i = 0; i < 17; i++) {
            this.setLed(i, 0, 0, 0);
        }
        console.log(this);
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
        // Set properties for liveReload
        console.log(this);
        var that = this;
        this.program = program;

        jQuery.get("src/" + program + "/" + program + ".ino").success(function(data) {
            // Cache the data for liveReload
            that.dataCache = data;

            // Get start of code block based on method name
            var startChr = data.indexOf("void " + method + "()");
            var code = data.substr(startChr);
            var tmpCode;

            // Find end of code block by comparing counts of opening + closing brackets
            var cutOff = 0;
            var offset = 0;
            do {
                var openCount = 0;
                var closeCount = 0;
                cutOff++;
                offset = code.indexOf('}', offset) + 1;
                tmpCode = code.substr(0, offset);

                var open = tmpCode.match(/{/g);
                openCount = open ? open.length : 0;
                var close = tmpCode.match(/}/g);
                closeCount = close ? close.length : 0;
            } while (closeCount != openCount || cutOff == 10);

            // Replace void with function
            tmpCode = tmpCode.replace("void " + method + "()", "(function()");

            // Replace int/char with var
            code = tmpCode.replace(/(int|char|CRGB)\s/g, "var ") + ")();";

            // Honest, this is safe
            eval(code);

            // if that didn't crash, configure the live reload
            setInterval(that.liveReload, 5000);
        });
    },
    show: function () {
        FastLED.show();
    },
    liveReload: function() {
        jQuery.get("src/" + McRoboFace.program + "/" + McRoboFace.program + ".ino").success(function(data) {
            if (data != McRoboFace.dataCache) {
                location.reload();
            } else {
                console.log('data matches');
            }
        });
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

