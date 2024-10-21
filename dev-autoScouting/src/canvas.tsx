import { useEffect, useRef, useState } from "react";
import './style/canvas.css'
import Note from "./note";


const Notes: Note[] = [
   new Note(-1), // pre-load
   new Note(0),
   new Note(1),
   new Note(2),
   new Note(3),
   new Note(4),
   new Note(5),
   new Note(6),
   new Note(7),
];
const AutoPath: Note[] = [Notes[0]];
const Canvas = () => {
   const alliance = false;
   const canvasRef = useRef<HTMLCanvasElement>(null);
   const [active, setActive] = useState(true);

   const handleCanvasClick = (event: React.MouseEvent) => {
      const canvas = canvasRef.current;
      if (canvas && !active) {
         const rect = canvas.getBoundingClientRect();
         const x = event.clientX - rect.left;
         const y = event.clientY - rect.top;
         if (alliance) {
            for (const note of Notes) {
               if (
                  note.isClicked == false &&
                  x <= 325 - note.x + 15 &&
                  x >= 325 - note.x - Note.width - 15 &&
                  y >= note.y - 15 &&
                  y <= note.y + Note.width + 15
               ) {

                  note.isClicked = true;
                  AutoPath.push(note);
                  console.log(AutoPath);
                  setActive(true);
               }
            }
         }
         else {
            for (const note of Notes) {
               if (
                  note.isClicked == false &&
                  x >= note.x - 15 &&
                  x <= note.x + Note.width + 15 &&
                  y >= note.y - 15 &&
                  y <= note.y + Note.width + 15
               ) {

                  note.isClicked = true;
                  AutoPath.push(note);
                  console.log(AutoPath);
                  setActive(true);
               }
            }
         }
      }
   }

   useEffect(() => {
      const canvas = canvasRef.current;

      if (canvas) {
         const ctx = canvas.getContext('2d');
         const scale = 10;
         canvas.width = canvas.getBoundingClientRect().width * scale;
         canvas.height = canvas.getBoundingClientRect().height * scale;
         ctx!.clearRect(0, 0, canvas.width, canvas.height);
         if (ctx) {
            ctx.scale(scale, scale);

            // Draw the Notes
            for (const note of Notes) {
               note.draw(ctx);
            }

            // Catmull-Rom spline interpolation function
            const catmullRom = (p0: any, p1: any, p2: any, p3: any, t: number) => {
               const t2 = t * t;
               const t3 = t2 * t;
               return {
                  x: 0.5 * ((2 * p1.x) +
                     (-p0.x + p2.x) * t +
                     (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
                     (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3),
                  y: 0.5 * ((2 * p1.y) +
                     (-p0.y + p2.y) * t +
                     (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
                     (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3)
               };
            };

            // Ensure there are enough points to form a spline
            ctx.beginPath();
            
            if(AutoPath.length>2){

               const p0 = AutoPath[1]; // First point
               const p1 = AutoPath[2]; // Second point
               const p2 = AutoPath[AutoPath.length-2]; // First point
               const p3 = AutoPath[AutoPath.length-1]; // Second point
               
               ctx.moveTo(p0.x + 7.5, p0.y + 7.5);

               const ghostBefore = { x: 2 * p0.x - p1.x, y: 2 * p0.y - p1.y }; // Ghost point before the first one
               const ghostAfter = { x: 2 * p2.x - p3.x, y: 2 * p2.y - p3.y };
               
               if (AutoPath.length == 3) {


                  for (let t = 0; t <= 1; t += 0.01) {
                     const p = catmullRom(ghostBefore, p0, p1, ghostAfter, t);
                     ctx.lineTo(p.x + 7.5, p.y + 7.5);
                  }
   
               }
               else if (AutoPath.length == 4) {
   
   
                  // Calculate the interpolation between pA, pB, and pC using Catmull-Rom
                  for (let t = 0; t <= 1; t += 0.01) {
                     const p = catmullRom(ghostBefore, p0, p1,p3, t);
                     ctx.lineTo(p.x + 7.5, p.y + 7.5);
                  }
   
                  for (let t = 0; t <= 1; t += 0.01) {
                     const p = catmullRom(p0, p1, p3, ghostAfter, t);
                     ctx.lineTo(p.x + 7.5, p.y + 7.5);
                  }
   
               }
               else{
   

   
                  // Draw the first segment using the ghost point
                  for (let t = 0; t <= 1; t += 0.01) {
                     const p = catmullRom(ghostBefore, AutoPath[1], AutoPath[2], AutoPath[3], t);
                     ctx.lineTo(p.x + 7.5, p.y + 7.5);
                  }
   
                  for (let i = 2; i < AutoPath.length - 2; i++) {
                     // Interpolate between the points
   
                     for (let t = 0; t <= 1; t += 0.01) {
                        const p = catmullRom(
                           AutoPath[i - 1],
                           AutoPath[i],
                           AutoPath[i + 1],
                           AutoPath[i + 2], t);
                        ctx.lineTo(p.x + 7.5, p.y + 7.5);
                     }
                  }
                  for (let t = 0; t <= 1; t += 0.01) {
                     const p = catmullRom(AutoPath[AutoPath.length - 3], AutoPath[AutoPath.length - 2], AutoPath[AutoPath.length - 1], ghostAfter, t);
                     ctx.lineTo(p.x + 7.5, p.y + 7.5);
                  }
   
   
               }
               ctx.stroke();
            }
            
         }
      }
   });


   const handleScore = () => {
      if (active) {
         setActive(false);
         AutoPath[AutoPath.length - 1].success = true;
      }
   }

   const handleMiss = () => {
      if (active) {
         setActive(false);
         AutoPath[AutoPath.length - 1].success = false;
      }
   }

   return (
      <>
         <div id="auto">
            <div id="svg-border">
               {alliance ? (
                  <svg id="svg" viewBox="0 0 327 233" fill="none" className="flipped">
                     <path d="M323.998 3.26295H213.758M3.38953 3.26295H115.292M115.292 3.26295L107.468 13.4348L157.923 96.7377H172.594L221.094 13.4348L213.758 3.26295M115.292 3.26295H213.758M3.38953 104.59H19.821V158.971M19.821 229.978V158.971M19.821 158.971H292.309M65.7899 229.978L87.6985 196.528H127.408L146.578 229.978"
                        stroke="#B54545" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"
                     />
                     <path d="M251.232 229.784L293.093 158.776H321.261L280.965 229.784"
                        stroke="#3F82C6" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
               ) : (
                  <svg id="svg" viewBox="0 0 327 233" fill="none">
                     <path d="M323.998 3.26295H213.758M3.38953 3.26295H115.292M115.292 3.26295L107.468 13.4348L157.923 96.7377H172.594L221.094 13.4348L213.758 3.26295M115.292 3.26295H213.758M3.38953 104.59H19.821V158.971M19.821 229.978V158.971M19.821 158.971H292.309M65.7899 229.978L87.6985 196.528H127.408L146.578 229.978"
                        stroke="#3F82C6" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                     <path d="M251.232 229.784L293.093 158.776H321.261L280.965 229.784"
                        stroke="#B54545" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>)
               }

               <canvas
                  ref={canvasRef}
                  id="canvas"
                  onClick={handleCanvasClick}
                  className={alliance ? "flipped" : ""}
               >
               </canvas>
            </div>
            <div id="auto-button-bar">
               <button
                  id="auto-button"
                  className={active ? "active" : "inactive"}
                  onClick={handleScore}
               >
                  Score
               </button>
               <button
                  id="auto-button"
                  className={active ? "active" : "inactive"}
                  onClick={handleMiss}
               >
                  Miss
               </button>
               <button
                  id="auto-undo-button"
                  className="inactive"
               >
                  undo
               </button>
            </div>
         </div>
      </>
   )
}
export default Canvas;