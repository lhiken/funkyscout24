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
            for (const note of Notes) {
               note.draw(ctx);
            }
            for (let i =1;i<AutoPath.length-1;i++){
               const xStart = AutoPath[i].x+7.5;
               const yStart = AutoPath[i].y+7.5;
               const xEnd = AutoPath[i+1].x+7.5;
               const yEnd = AutoPath[i+1].y+7.5;

               const midPointX = (AutoPath[i].x + AutoPath[i + 1].x) / 2;
               const midPointY = (AutoPath[i].y + AutoPath[i + 1].y) / 2;

               ctx.moveTo(xStart,yStart)
               ctx.quadraticCurveTo(AutoPath[i].x, AutoPath[i].y, midPointX, midPointY);
               ctx.lineTo(AutoPath[AutoPath.length - 1].x, AutoPath[AutoPath.length - 1].y);
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