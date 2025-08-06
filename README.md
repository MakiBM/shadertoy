# shadertoy-renderer

A lightweight WebGL 2.0 shader renderer for ShaderToy-compatible fragment shaders.

## Original Project

This is an npm package version of **ShaderToyLite.js** by **chipweinberger**.

- **Original Repository**: [https://github.com/chipweinberger/ShaderToyLite.js](https://github.com/chipweinberger/ShaderToyLite.js)
- **Original Author**: [chipweinberger](https://github.com/chipweinberger)
- **Original Demo**: [https://chipweinberger.github.io/ShaderToyLite.js/ShaderToyLite-demo.html](https://chipweinberger.github.io/ShaderToyLite.js/ShaderToyLite-demo.html)

## Features

- 🚀 Lightweight - Only ~400 lines of code
- 🔧 Direct ShaderToy compatibility - Load shaders without modification
- 🎯 Pixel-perfect rendering
- 🔄 Multiple buffer support (BufferA, BufferB, BufferC, BufferD)
- 🖼️ Custom texture support
- 📱 WebGL 2.0 powered
- 🎮 Mouse and time-based interactions

## Installation

```bash
npm install shadertoy-renderer
```

## Usage

### ES6 Modules
```javascript
import ShaderToyRenderer from 'shadertoy-renderer';

const toy = new ShaderToyRenderer('myCanvas');
toy.setImage({
    source: `
        void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
            vec2 uv = fragCoord/iResolution.xy;
            vec3 col = 0.5 + 0.5*cos(iTime+uv.xyx+vec3(0,2,4));
            fragColor = vec4(col,1.0);
        }
    `
});
toy.play();
```

### CommonJS
```javascript
const ShaderToyRenderer = require('shadertoy-renderer');

const toy = new ShaderToyRenderer('myCanvas');
// ... same usage as above
```

## API

### Constructor
- `new ShaderToyRenderer(canvasId)` - Initialize with canvas element ID

### Shader Methods
- `setCommon(source)` - Set shared shader code
- `setBufferA(config)` - Configure buffer A shader
- `setBufferB(config)` - Configure buffer B shader  
- `setBufferC(config)` - Configure buffer C shader
- `setBufferD(config)` - Configure buffer D shader
- `setImage(config)` - Set main image shader

### Playback Control
- `play()` - Start animation
- `pause()` - Pause animation
- `reset()` - Reset animation to beginning
- `time()` - Get current animation time in seconds
- `isPlaying()` - Check if animation is playing

### Utility Methods
- `addTexture(texture, key)` - Add custom texture
- `setOnDraw(callback)` - Set custom draw callback

## Configuration Object

When setting shaders, use a configuration object:

```javascript
{
    source: "void mainImage...",  // Shader source code
    iChannel0: "A",              // Input from BufferA
    iChannel1: "B",              // Input from BufferB
    iChannel2: "rock",           // Input from custom texture
    iChannel3: "C"               // Input from BufferC
}
```

## Supported Uniforms

All standard ShaderToy uniforms are supported:

- `iResolution` - Viewport resolution
- `iTime` - Shader playback time
- `iTimeDelta` - Render time between frames
- `iFrame` - Frame counter
- `iMouse` - Mouse coordinates
- `iDate` - Current date/time
- `iChannel0-3` - Input textures
- `iChannelTime[4]` - Channel playback times
- `iChannelResolution[4]` - Channel resolutions

## Requirements

- WebGL 2.0 compatible browser
- Canvas element in the DOM

## Limitations

- WebGL 2.0 only (no WebGL 1.0 fallback)
- No built-in VR, sound, or keyboard support
- Some rendering issues on iOS devices
- No pre-provided textures (you must supply your own)

## Example

```html
<!DOCTYPE html>
<html>
<head>
    <script type="module">
        import ShaderToyRenderer from './node_modules/shadertoy-renderer/index.js';
        
        const toy = new ShaderToyRenderer('canvas');
        
        toy.setImage({
            source: `
                void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
                    vec2 uv = fragCoord/iResolution.xy;
                    vec3 col = 0.5 + 0.5*cos(iTime+uv.xyx+vec3(0,2,4));
                    fragColor = vec4(col,1.0);
                }
            `
        });
        
        toy.play();
    </script>
</head>
<body>
    <canvas id="canvas" width="800" height="600"></canvas>
</body>
</html>
```

## License

MIT - Check the [original repository](https://github.com/chipweinberger/ShaderToyLite.js) for licensing details.