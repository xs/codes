uniform vec2 u_resolution;
uniform float u_time;

varying vec4 vPosition;

vec2 rand2(vec2 p) {
    return fract(sin(vec2(dot(p.yx, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))) * 43758.5453);
}

float smoothNoise(vec2 uv) {
    vec2 i = floor(uv);
    vec2 f = fract(uv);
    vec2 u = f*f*(3.0-2.0*f);

    vec2 i0 = i;
    vec2 i1 = i + vec2(1.0, 0.0);
    vec2 i2 = i + vec2(0.0, 1.0);
    vec2 i3 = i + vec2(1.0, 1.0);

    float a = dot(rand2(i0), f);
    float b = dot(rand2(i1), f - vec2(1.0, 0.0));
    float c = dot(rand2(i2), f - vec2(0.0, 1.0));
    float d = dot(rand2(i3), f - vec2(1.0, 1.0));

    // Using mix directly and interpolate.
    float horizBlend = mix(a, b, u.x);
    float vertBlend = mix(c, d, u.x);

    float value = mix(horizBlend, vertBlend, u.y);
    return clamp(0.5 + value * 1.5, 0.0, 1.0);
}


float hash(float n) {
    return fract(sin(n) * 43758.5453);
}

float valueNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);

    // Smooth step function for interpolation
    vec2 u = f * f * (3.0 - 2.0 * f);

    // Four corner values
    float a = hash(dot(i, vec2(1.0, 157.0)));
    float b = hash(dot(i + vec2(1.0, 0.0), vec2(1.0, 157.0)));
    float c = hash(dot(i + vec2(0.0, 1.0), vec2(1.0, 157.0)));
    float d = hash(dot(i + vec2(1.0, 1.0), vec2(1.0, 157.0)));

    // Interpolate using the smooth step values
    float horizBlend = mix(a, b, u.x);
    float vertBlend = mix(c, d, u.x);
    return mix(horizBlend, vertBlend, u.y);
}


float noise(float seed, float speed) {
    return 2. * smoothNoise(vec2(u_time * speed, seed + sin(1.)));
}

float noise(float seed) {
    return noise(seed, .5);
}

bool inLine(vec2 st, vec2 start, vec2 end, float thickness) {
    float halfThickness = thickness * 0.5;
    
    // Check if st.x and st.y are between start and end, considering the thickness
    if(st.x < min(start.x, end.x) - halfThickness || st.x > max(start.x, end.x) + halfThickness || 
       st.y < min(start.y, end.y) - halfThickness || st.y > max(start.y, end.y) + halfThickness) {
        return false;
    }
    
    vec2 dir = normalize(end - start);
    vec2 normal = vec2(-dir.y, dir.x);

    vec2 fromStartToPoint = st - start;
    
    float dotDir = dot(fromStartToPoint, dir);
    float distanceFromLine = dot(fromStartToPoint, normal);
    
    // Compute the projection relative to the start point
    vec2 projectionFromStart = dotDir * dir;
    
    // Check if this projection lies between start and end
    bool withinSegment = dot(projectionFromStart, projectionFromStart - (end - start)) <= 0.0;

    return abs(distanceFromLine) < (thickness * 0.5) && withinSegment;
}

vec2 pointOnCircle(vec2 c, float r, float arc) {
    float theta = arc * 2. * PI;
    
    return c + vec2(cos(theta) * u_resolution.y / u_resolution.x, sin(theta) * 1.) * r;;
}

vec3 drawLine(vec2 st, vec2 start, vec2 end, vec3 lineColor, vec3 bgColor) {
    float thickness = 1.2;
    if (inLine(st, start, end, thickness / 1000.)) {
        return mix(bgColor, lineColor, 1.);
    }
    return bgColor;
}

vec3 drawPoly(vec2 st, vec3 bgColor, vec2 c, float r, int n, float jitter) {
    // given a center c and radius r, draw a georg nees n-gon
    vec3 color = bgColor;
    float rX = r * u_resolution.y / u_resolution.x;
    float rY = r;
        
    if(st.x < c.x - rX || st.x > c.x + rX || st.y < c.y - rY || st.y > c.y + rY) {
        return bgColor;
    }

    // hardcoding 100 here as MAX_VERTICES
    for(int i = 0; i < 100; ++i) {
        if (i >= n) {
            break;
        }
        int j = i == n - 1 ? 0 : i + 1;
        
        float fracA = float(i) / float(n);
        float fracB = float(j) / float(n);
        
        float SPEED_FACTOR = 0.25;
        
        float noiseSpeed = SPEED_FACTOR + SPEED_FACTOR / 5. * jitter;
        
        float angle0 = float(i) * fracA + noise(float(i) * 10. + jitter, noiseSpeed);
        float angle1 = float(j) * fracB + noise(float(j) * 10. + jitter, noiseSpeed);
        
        vec2 p0 = pointOnCircle(c, r, angle0);
        vec2 p1 = pointOnCircle(c, r, angle1);
        
        color = drawLine(st, p0, p1, vec3(0), color);
    }
    
    return color;
}

void main() {
    vec2 st = (vPosition.xy + u_resolution * 0.5) / u_resolution;

    if (vPosition.z < 0.) {
        csm_DiffuseColor = vec4(1.);
        return;
    }

    // from GLSL: vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec3 color = vec3(.99,0.23,0.15);
    
    const int MAX_ROWS = 20;
    const int COLS = 9;
    const float MX = 0.022;
    float MY = MX * u_resolution.y / u_resolution.x;
    float RADIUS = (u_resolution.x / u_resolution.y - 2. * MX) / float(COLS) / 2.;
    
    int ROWS = int(floor( (1. - MY) / (2. * RADIUS)));
    MY = (1. - RADIUS * 2. * float(ROWS))/ 2.;
    
    for (int row = 0; row < MAX_ROWS; row++) {
        if (row >= ROWS) {
            break;
        }
        for (int col = 0; col < COLS; col++) {
            float cx = (float(col) * 2. * RADIUS + MX + RADIUS) * (u_resolution.y / u_resolution.x);
            float cy = 1. - (float(row) * 2. * RADIUS + MY + RADIUS);
            
            vec2 c =  vec2(cx, cy);
            int n = 3 + col + 9 * row;
            color = drawPoly(st, color, c, RADIUS, row * COLS + col + 3, sin(float(n)));
        }
    }
    csm_DiffuseColor = vec4(color,1.0);
}