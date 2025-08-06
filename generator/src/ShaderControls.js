import React, { useState, useRef } from 'react';

const ShaderControls = ({ config, onConfigChange }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isDragging, setIsDragging] = useState(null);

  const handleChange = (path, value) => {
    const newConfig = { ...config };
    if (typeof path === 'string' && path.includes('.')) {
      const keys = path.split('.');
      let current = newConfig;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = parseFloat(value) || 0;
    } else {
      newConfig[path] = parseFloat(value) || 0;
    }
    onConfigChange(newConfig);
  };

  const handleColorChange = (colorPath, component, value) => {
    const newConfig = { ...config };
    newConfig[colorPath][component] = parseFloat(value) || 0;
    onConfigChange(newConfig);
  };

  const handleMouseDown = (path, min, max, e) => {
    setIsDragging({ path, min, max, startX: e.clientX, type: 'normal' });
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (isDragging && isDragging.type === 'normal') {
      const deltaX = e.clientX - isDragging.startX;
      const range = isDragging.max - isDragging.min;
      const delta = (deltaX / 200) * range; // 200px = full range
      const currentValue = config[isDragging.path] || 0;
      const newValue = Math.min(isDragging.max, Math.max(isDragging.min, currentValue + delta));
      
      handleChange(isDragging.path, newValue.toString());
      setIsDragging({ ...isDragging, startX: e.clientX });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(null);
  };

  React.useEffect(() => {
    if (isDragging) {
      const mouseMoveHandler = isDragging.type === 'color' ? handleColorMouseMove : handleMouseMove;
      
      document.addEventListener('mousemove', mouseMoveHandler);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);

  const SliderControl = ({ label, value, min, max, path }) => (
    <div style={{ marginBottom: '8px' }}>
      <label style={{
        display: 'block',
        fontSize: '12px',
        color: '#d1d5db',
        marginBottom: '4px'
      }}>{label}</label>
      <div 
        style={{
          width: '100%',
          height: '4px',
          backgroundColor: '#4b5563',
          borderRadius: '2px',
          position: 'relative',
          cursor: 'pointer'
        }}
        onMouseDown={(e) => handleMouseDown(path, min, max, e)}
      >
        <div 
          style={{
            position: 'absolute',
            left: `${((value - min) / (max - min)) * 100}%`,
            top: '-2px',
            width: '8px',
            height: '8px',
            backgroundColor: 'white',
            borderRadius: '50%',
            transform: 'translateX(-50%)',
            cursor: 'grab'
          }}
        />
      </div>
    </div>
  );

  const handleColorMouseDown = (colorPath, component, min, max, e) => {
    setIsDragging({ colorPath, component, min, max, startX: e.clientX, type: 'color' });
    e.preventDefault();
  };

  const handleColorMouseMove = (e) => {
    if (isDragging && isDragging.type === 'color') {
      const deltaX = e.clientX - isDragging.startX;
      const range = isDragging.max - isDragging.min;
      const delta = (deltaX / 200) * range;
      const currentValue = config[isDragging.colorPath][isDragging.component] || 0;
      const newValue = Math.min(isDragging.max, Math.max(isDragging.min, currentValue + delta));
      
      handleColorChange(isDragging.colorPath, isDragging.component, newValue.toString());
      setIsDragging({ ...isDragging, startX: e.clientX });
    }
  };

  const ColorSlider = ({ color, colorPath, component, backgroundColor }) => (
    <div 
      style={{
        flex: 1,
        height: '4px',
        backgroundColor,
        borderRadius: '2px',
        position: 'relative',
        cursor: 'pointer'
      }}
      onMouseDown={(e) => handleColorMouseDown(colorPath, component, 0, 10, e)}
    >
      <div 
        style={{
          position: 'absolute',
          left: `${(color[component] / 10) * 100}%`,
          top: '-2px',
          width: '8px',
          height: '8px',
          backgroundColor: 'white',
          borderRadius: '50%',
          transform: 'translateX(-50%)',
          cursor: 'grab'
        }}
      />
    </div>
  );

  const ColorControl = ({ label, color, colorPath }) => (
    <div style={{ marginBottom: '8px' }}>
      <label style={{
        display: 'block',
        fontSize: '12px',
        color: '#d1d5db',
        marginBottom: '4px'
      }}>{label}</label>
      <div style={{ display: 'flex', gap: '4px' }}>
        <ColorSlider color={color} colorPath={colorPath} component="r" backgroundColor="#dc2626" />
        <ColorSlider color={color} colorPath={colorPath} component="g" backgroundColor="#16a34a" />
        <ColorSlider color={color} colorPath={colorPath} component="b" backgroundColor="#2563eb" />
      </div>
    </div>
  );

  const BurgerIcon = ({ isOpen }) => (
    <div style={{
      width: '24px',
      height: '20px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      cursor: 'pointer'
    }}>
      <div 
        style={{
          width: '20px',
          height: '2px',
          backgroundColor: 'white',
          transition: 'all 0.3s',
          transform: isOpen ? 'rotate(45deg) translateY(4px)' : 'none',
          marginBottom: isOpen ? 0 : '4px'
        }}
      />
      <div 
        style={{
          width: '20px',
          height: '2px',
          backgroundColor: 'white',
          transition: 'all 0.3s',
          transform: isOpen ? 'rotate(-45deg) translateY(-4px)' : 'none'
        }}
      />
    </div>
  );

  return (
    <div style={{
      position: 'fixed',
      top: '16px',
      right: '16px',
      zIndex: 50
    }}>
      <div style={{
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderRadius: '8px',
        padding: '16px',
        transition: 'all 0.3s',
        width: isExpanded ? '320px' : '48px'
      }}>
        {!isExpanded ? (
          <button
            onClick={() => setIsExpanded(true)}
            style={{
              width: '16px',
              height: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'none',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <BurgerIcon isOpen={false} />
          </button>
        ) : (
          <div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px'
            }}>
              <h3 style={{
                color: 'white',
                fontSize: '14px',
                fontWeight: '600',
                margin: 0
              }}>Shader Controls</h3>
              <button
                onClick={() => setIsExpanded(false)}
                style={{
                  padding: '4px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <BurgerIcon isOpen={true} />
              </button>
            </div>

            <div style={{
              maxHeight: '100vh',
              overflowY: 'auto'
            }}>
              <div style={{ marginBottom: '12px' }}>
                <h4 style={{
                  color: 'white',
                  fontSize: '12px',
                  fontWeight: '500',
                  marginBottom: '8px',
                  margin: 0
                }}>Animation</h4>
                <SliderControl label="Time Speed" value={config.timeSpeed} min={0} max={3} path="timeSpeed" />
                <SliderControl label="Rotation Speed 1" value={config.rotationSpeed1} min={0} max={2} path="rotationSpeed1" />
                <SliderControl label="Rotation Speed 2" value={config.rotationSpeed2} min={0} max={2} path="rotationSpeed2" />
                <SliderControl label="Wave Speed" value={config.waveSpeed} min={0} max={2} path="waveSpeed" />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <h4 style={{
                  color: 'white',
                  fontSize: '12px',
                  fontWeight: '500',
                  marginBottom: '8px',
                  margin: 0
                }}>Colors</h4>
                <ColorControl label="Base Color" color={config.baseColor} colorPath="baseColor" />
                <ColorControl label="Accent Color" color={config.accentColor} colorPath="accentColor" />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <h4 style={{
                  color: 'white',
                  fontSize: '12px',
                  fontWeight: '500',
                  marginBottom: '8px',
                  margin: 0
                }}>Effects</h4>
                <SliderControl label="Wave Amplitude" value={config.waveAmplitude} min={0} max={2} path="waveAmplitude" />
                <SliderControl label="Color Intensity" value={config.colorIntensity} min={0} max={2} path="colorIntensity" />
                <SliderControl label="Complexity" value={config.complexity} min={1} max={20} path="complexity" />
                <SliderControl label="Iterations" value={config.iterations} min={5} max={20} path="iterations" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShaderControls;