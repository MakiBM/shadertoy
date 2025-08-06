// Default shader configuration
export const defaultConfig = {
  // Time multipliers for different animations
  timeSpeed: 1.0,
  rotationSpeed1: 0.4,
  rotationSpeed2: 0.3,
  waveSpeed: 0.4,
  
  // Colors (RGB values 0-1)
  baseColor: { r: 0.3, g: 0.4, b: 0.5 },
  accentColor: { r: 8.0, g: 5.0, b: 7.0 },
  
  // Animation parameters
  waveAmplitude: 0.7,
  colorIntensity: 0.7,
  rayStepSize: 0.2,
  maxDistance: 2.0,
  
  // Geometric parameters
  complexity: 6.0,
  distanceOffset: 2.0,
  rayOriginDistance: 7.0,
  iterations: 10
};

// Generate shader source with configuration parameters
export const generateShader = (config) => {
  return `
float distanceField(vec3 pos, float time) {
    vec3 p = pos;
    
    // Apply rotations using rotation matrices with configurable speed
    float angle1 = time * ${config.rotationSpeed1.toFixed(3)};
    mat2 rotation1 = mat2(cos(angle1), -sin(angle1), sin(angle1), cos(angle1));
    p.xz *= rotation1;
    
    float angle2 = time * ${config.rotationSpeed2.toFixed(3)};
    mat2 rotation2 = mat2(cos(angle2), -sin(angle2), sin(angle2), cos(angle2));
    p.xy *= rotation2;
    
    // Complex distance field calculation
    float dist = length(p + sin(time * ${config.waveSpeed.toFixed(3)})) * log(length(p) + 1.0);
    
    // Add more complexity with nested sin functions
    vec3 offset = p + p + time;
    float wave1 = sin(offset.y + offset.z);
    float wave2 = sin(wave1 + offset.x);
    
    dist += wave2 * ${config.waveAmplitude.toFixed(3)} - ${config.distanceOffset.toFixed(3)};
    
    return dist;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec3 rayOrigin, rayPos, colorAccumulator;
    vec3 resolution = iResolution;
    float time = iTime * ${config.timeSpeed.toFixed(3)};
    
    // Initialize ray marching loop
    for (float marchDistance = 1.5, rayDistance; 
         resolution.z++ < ${config.iterations.toFixed(1)};
         
         // Color accumulation and output with configurable colors
         fragColor.xyz = colorAccumulator = max(colorAccumulator + ${config.colorIntensity.toFixed(3)} - rayDistance * ${config.rayStepSize.toFixed(3)}, 
                                               colorAccumulator)
                        * (vec3(${config.baseColor.r.toFixed(3)}, ${config.baseColor.g.toFixed(3)}, ${config.baseColor.b.toFixed(3)}) - 
                           vec3(${config.accentColor.r.toFixed(3)}, ${config.accentColor.g.toFixed(3)}, ${config.accentColor.b.toFixed(3)}) * 
                           (distanceField(rayPos, time) - rayDistance) / ${config.complexity.toFixed(3)})
        ) {
        
        // Set up ray origin and position
        rayPos = rayOrigin = vec3((fragCoord - 0.5 * resolution.xy) / resolution.y * marchDistance, 
                                  ${config.rayOriginDistance.toFixed(3)} - marchDistance);
        
        // March the ray forward
        marchDistance += min(rayDistance = distanceField(rayPos, time), ${config.maxDistance.toFixed(3)});
        
        // Slight offset for next iteration
        rayPos = rayOrigin + 0.1;
    }
}`;
};