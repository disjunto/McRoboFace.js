#include "FastLED.h" 

// WS2812B definitions
#define NUM_LEDS 17
#define DATA_PIN A5

/**
 * @param CRGB[] LED Colour data
 */
CRGB leds[NUM_LEDS];

/**
 *@param int LED brightness
 */
int bright = 50;

/**
 *@param int Time between stage
 */
int wait = 10;

/**
 * Initialise globals for safe mapping between JS and C
 */
int red = 0;
int green = 0;
int blue = 0;
int start = 0;

/**
 * Initialise LEDs in FastLED and set brightness
 */
void setup()
{
  // sanity check delay - allows reprogramming if accidently blowing power w/leds
  delay(1000);

  FastLED.addLeds<WS2812B, DATA_PIN, RGB>(leds, NUM_LEDS);
  FastLED.setBrightness(bright);
  allOff();
}

/**
 * Main program loop to fade all LEDs through RGB space
 */
void loop()
{
  step();
}

void step()
{
    int led;
    if (start > 764) {
        start = 0;
        red = 0;
        green = 0;
        blue = 255;
    }

    if (start < 255) {
        red++;
        blue--;
        green = 0;
    } else if (start < 510) {
        green++;
        red--;
        blue = 0;
    } else if (start < 765) {
        blue++;
        green--;
        red = 0;
    }


    // Lower LEDs
    for (led = 1; led < 5; led++) {
        leds[led] = CRGB(green, red, blue);
    }

    // Top LEDs
    for (led = 6; led < 10; led++) {
        leds[led] = CRGB(red, blue, green);
    }

    // Middle LEDs
    for (led = 10; led < 15; led++) {
        leds[led] = CRGB(blue, green, red);
    }
    leds[0] = CRGB(blue, green, red);
    leds[5] = CRGB(blue, green, red);


    // Debug on eyes + nose
    leds[NUM_LEDS - 1] = CRGB(0, red, 0);
    leds[NUM_LEDS - 3] = CRGB(green, 0, 0);
    leds[NUM_LEDS - 2] = CRGB(0, 0, blue);


    // Write to controller + wait
    FastLED.show();

    // Next step with delay
    start++;
    delay(10);
}

void allOff()
{
  for (int i=0; i<NUM_LEDS; i++)
    leds[i] = 0;
  FastLED.show();
}
