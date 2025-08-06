import React, { useEffect, useRef } from 'react';
import ShaderToyRenderer from './ShaderToyRenderer';

const ShaderDisplay = ({ shaderSource }) => {
  const canvasRef = useRef(null);
  const rendererRef = useRef(null);

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

    if (canvasRef.current && shaderSource) {
      // Generate unique canvas ID
      const canvasId = `shader-canvas-${Math.random().toString(36).substring(2, 11)}`;
      canvasRef.current.id = canvasId;
      
      try {
        // Initialize renderer
        rendererRef.current = new ShaderToyRenderer(canvasId);
        
        // Set shader
        rendererRef.current.setImage({ source: shaderSource });
        
        // Start animation
        rendererRef.current.play();
        
        console.log('Shader initialized successfully');
      } catch (error) {
        console.error('Failed to initialize shader:', error);
      }
    }

    // Cleanup
    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      if (rendererRef.current) {
        rendererRef.current.pause();
      }
    };
  }, [shaderSource]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-screen h-screen block m-0 p-0 border-none"
    />
  );
};

export default ShaderDisplay;