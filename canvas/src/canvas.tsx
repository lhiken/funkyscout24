import React, { useEffect, useRef, useState } from 'react';
import './canvas.css'
import './button'
import Button from './button';
const CanvasWithButton: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isClicked, setIsClicked] = useState(false);

  // Button position and size
  const testButton = new Button(0,10,30,30,"O","orange","white")

  const handleCanvasClick = (event: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const button = testButton;
      if (
        x >= button.x &&
        x <= button.x + button.width &&
        y >= button.y &&
        y <= button.y + button.height
      ) {
        // Button was clicked
        setIsClicked(!isClicked);
        console.log("yes yes yes")
      }
    }
  };

  // Initial drawing and updating the button state
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        testButton.draw(ctx);
      }
    }
  }, [isClicked]);

  return (
    <canvas
      ref={canvasRef}
      width={300}
      height={300}
      onClick={handleCanvasClick}
      id="canvas"
    />
  );
};

export default CanvasWithButton;
