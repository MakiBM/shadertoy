import React, { useState, useEffect } from 'react';
import ShaderDisplay from './ShaderDisplay';
import ShaderControls from './ShaderControls';
import { defaultConfig, generateShader } from './ShaderConfig';

function App() {
  const [config, setConfig] = useState(defaultConfig);
  const [shaderSource, setShaderSource] = useState(() => generateShader(defaultConfig));

  // Update shader when config changes
  useEffect(() => {
    const newShader = generateShader(config);
    console.log('Generated shader:', newShader); // Debug log
    setShaderSource(newShader);
  }, [config]);

  const handleConfigChange = (newConfig) => {
    setConfig(newConfig);
  };

  return (
    <div style={{
      margin: 0,
      padding: 0,
      width: '100vw',
      height: '100vh',
      overflow: 'hidden'
    }}>
      <ShaderDisplay shaderSource={shaderSource} />
      <ShaderControls 
        config={config}
        onConfigChange={handleConfigChange}
      />
    </div>
  );
}

export default App;