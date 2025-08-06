import React, { useEffect, useRef } from 'react';
import ShaderToyRenderer from './ShaderToyRenderer';

const ShaderDisplay = ({ shaderSource }) => {
  const canvasRef = useRef(null);
  const rendererRef = useRef(null);

  // Initialize renderer only once
  useEffect(() => {
    const updateCanvasSize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };

    // Set initial size
    updateCanvasSize();

    // Handle resize
    window.addEventListener('resize', updateCanvasSize);

    if (canvasRef.current && !rendererRef.current) {
      // Generate unique canvas ID
      const canvasId = `shader-canvas-${Math.random().toString(36).substring(2, 11)}`;
      canvasRef.current.id = canvasId;
      
      try {
        // Initialize renderer once
        rendererRef.current = new ShaderToyRenderer(canvasId);
        rendererRef.current.play();
        
        console.log('Shader renderer initialized');
      } catch (error) {
        console.error('Failed to initialize shader renderer:', error);
      }
    }

    // Cleanup
    return () => {
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, []);

  // Update shader source without recreating renderer
  useEffect(() => {
    if (rendererRef.current && shaderSource) {
      try {
        // Update shader without stopping animation
        rendererRef.current.setImage({ source: shaderSource });
        console.log('Shader updated');
      } catch (error) {
        console.error('Failed to update shader:', error);
      }
    }
  }, [shaderSource]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        display: 'block',
        margin: 0,
        padding: 0,
        border: 'none'
      }}
    />
  );
};

export default ShaderDisplay;