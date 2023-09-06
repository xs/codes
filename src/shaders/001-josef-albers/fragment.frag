// Author: 
// Title:

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

float seed = sin(floor(u_time / 1.160 )) + sin(1.);
float width = 0.45;
float height = 0.1;

float rand(float value) {
    return fract(sin(100. * seed * value));
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
    // Translate and rotate point 'p' relative to the center 'c' and angle 'theta'
    float cosTheta = cos(theta);
    float sinTheta = sin(theta);
    vec2 rotatedP = vec2(
        cosTheta * (p.x - c.x) - sinTheta * (p.y - c.y) + c.x,
        sinTheta * (p.x - c.x) + cosTheta * (p.y - c.y) + c.y
    );

    float right = c.x + w / 2.0;
    float left = c.x - w / 2.0;
    float top = c.y + h / 2.0;
    float bottom = c.y - h / 2.0;

    return (rotatedP.x < right && rotatedP.x > left && rotatedP.y < top && rotatedP.y > bottom);
}

void main() {
    // note: pass this order array in as a uniform in three.js
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
    
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec3 color = vec3(1.);
    
    float hue = rand(cos(seed));
    float sat = 0.544;
    float bright = 0.778;
    
    vec3 baseHSB = vec3(hue, sat, bright);
    vec3 baseColor = hsb2rgb(baseHSB);
    
    for (int i = 0; i < 9; i++) {
        // draw a blue rectangle at the position using blend
        float position = float(order[i] + 1);
        vec2 center = vec2(0.5, position * 0.1);
        float sign = 1. - 2. * mod(position, 2.);
        vec3 colorJitter = (rand3(position) / 8.) ;
        vec3 rectColor = baseColor + colorJitter * sign;
        
        float horizontal = rand(position * sin(position)) * .16 - .08;
        float vert = rand(position * 2.) * .02 - .01;
        
        center += vec2(horizontal, vert);
        
        float theta = rand(100. * position) * .3 - .15;
        
        if (inRotatedRect(st, center, width, height, theta)) {
            color = mix(color, rectColor, 1.);
        }
    }

    gl_FragColor = vec4(color,1.0);
}