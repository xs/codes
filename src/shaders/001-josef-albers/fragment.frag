uniform float u_time;
uniform vec2 u_resolution;

varying vec4 vPosition;

float seed = fract(sin(floor(1.)));
float width = 0.6;
float height = 0.1;

float rand(float value) {
    return fract(sin(100. * seed * value * floor(u_time / 1.5 + 1.)));
}

float mRand(float value, float m) {
    // return a random number between -m and m
    return rand(value) * m * 2. - m;
}

float rand(int value) {
    return rand(float(value));
}

vec3 rand3(float value) {
    return vec3(rand(value), rand(3. * value), rand(5. * value));
}

vec3 rand3(int value) {
    return rand3(float(value));
}

bool inRect(vec2 p, vec2 c, float w, float h) {
    float right = c.x + w / 2.;
    float left = c.x - w / 2.;
    float top = c.y + h / 2.;
    float bottom = c.y - h / 2.;
    return (p.x < right && p.x > left && p.y < top && p.y > bottom);
}

vec3 hsb2rgb( in vec3 c ){
    vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),
                             6.0)-3.0)-1.0,
                     0.0,
                     1.0 );
    rgb = rgb*rgb*(3.0-2.0*rgb);
    return c.z * mix(vec3(1.0), rgb, c.y);
}

bool inRotatedRect(vec2 p, vec2 c, float w, float h, float theta) {
    // rotate point 'p' relative to the center 'c' and angle 'theta'

    // process: 
    //  1. translate the point to the origin
    //  2. scale it by aspect ratio
    //  3. rotate it by theta
    //  4. undo the scale
    //  4. translate it back to the center of the rectangle

    // then check if it's in the rectangle

    float cosTheta = cos(theta);
    float sinTheta = sin(theta);
    
    vec2 d = vec2(
        (p.x - c.x) / u_resolution.y,
        (p.y - c.y) / u_resolution.x
    );

    vec2 rotatedD = vec2(
        cosTheta * d.x - sinTheta * d.y,
        sinTheta * d.x + cosTheta * d.y
    );

    vec2 rotatedP = vec2(
        rotatedD.x * u_resolution.y + c.x,
        rotatedD.y * u_resolution.x + c.y
    );

    float right = c.x + w / 2.0;
    float left = c.x - w / 2.0;
    float top = c.y + h / 2.0;
    float bottom = c.y - h / 2.0;

    return (rotatedP.x < right && rotatedP.x > left && rotatedP.y < top && rotatedP.y > bottom);
}

void main() {
    // TODO: pass this order array in as a uniform in three.js
    // this is back-to-front order of the rectangles

    int order[9];
    order[0] = 5;
    order[1] = 1;
    order[2] = 6;
    order[3] = 2;
    order[4] = 0;
    order[5] = 3;
    order[6] = 4;
    order[7] = 8;
    order[8] = 7;
    
    vec2 st = (vPosition.xy + u_resolution * 0.5) / u_resolution;

    if (vPosition.z < 0.) {
        csm_FragColor = vec4(1.);
        return;
    }

    // background color
    vec3 color = vec3(1.);
    
    float hue = rand(cos(seed));
    float saturation = 0.544;
    float brightness = 0.778;
    
    vec3 baseHSB = vec3(hue, saturation, brightness);
    vec3 baseColor = hsb2rgb(baseHSB);
    
    for (int i = 0; i < 9; i++) {

        float position = float(order[i] + 1);
        vec2 center = vec2(0.5, position * 0.1);

        // slightly jitter the color of each rectangle in RGB space.

        // we flip sign based on position to help neighboring
        // rectangles have a bit of light/dark contrast.
        float sign = 1. - 2. * mod(position, 2.);
        vec3 colorJitter = (rand3(position) / 8.) ;
        vec3 rectColor = baseColor + colorJitter * sign;
        
        float horizontal = mRand(position * sin(position), .08);
        float vert = mRand(position * 2., .015);
        
        center += vec2(horizontal, vert);
        
        float theta = mRand(12.1 * cos(position), .12);
        
        if (inRotatedRect(st, center, width, height, theta)) {
            color = mix(color, rectColor, 1.);
        }
    }

    csm_FragColor = vec4(color, 1.0);
}