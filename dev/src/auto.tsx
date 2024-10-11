import { useEffect, useRef, useState } from "react";
import Button from "./auto/button";
import React from "react";
import './auto.css'
const autoPath : Button[] = [];
const Auto: React.FC = () => {

   const canvasRef = useRef<HTMLCanvasElement>(null);
   const testButtons: Button[] = [
      new Button(0),
      new Button(1),
      new Button(2),
      new Button(3),
      new Button(4),
      new Button(5),
      new Button(6),
      new Button(7),
   ];
   


   const handleCanvasClick = (event: React.MouseEvent) => {

      const canvas = canvasRef.current;
      if (canvas) {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        for (const button of testButtons){
        if (
          x >= button.x -10 &&
          x <= button.x + button.width +10 &&
          y >= button.y -10 &&
          y <= button.y + button.width + 10
        ) {
          // Button was clicked
          button.isClicked=true;
          autoPath.push(button);
          console.log(autoPath);
        }
      }}
    };

   useEffect(() => {
      const canvas = canvasRef.current;

      if (canvas) {
         const ctx = canvas.getContext('2d');
         const scale = 50;
         canvas.width = 300 * scale;
         canvas.height = 300 * scale;
         canvas.clearRect(0, 0, canvas.width, canvas.height);
         if (ctx) {
            ctx.scale(scale, scale);
            for (const button of testButtons) {
               button.draw(ctx);
            }
         }
         
      }

   });


   return (
      <div id="auto">


         <canvas
            ref={canvasRef}
            id="auto-canvas"
            onClick={handleCanvasClick}
         />
      </div>

   );
}
export default Auto;