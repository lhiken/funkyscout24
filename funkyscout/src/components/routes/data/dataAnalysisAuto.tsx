import "./canvas.css";
import Note from "../auto/note";
import { useEffect, useRef } from "react";
const Notes: Note[] = [
   new Note(0),
   new Note(1),
   new Note(2),
   new Note(3),
   new Note(4),
   new Note(5),
   new Note(6),
   new Note(7),
];

const DataAnalysisAuto = (
   { alliance, startPosition, AutoPath }: {
      alliance: boolean;
      startPosition: number;
      AutoPath: Note[];
   },
) => {

   const canvasRef = useRef<HTMLCanvasElement>(null);

   useEffect(() => {
      const canvas = canvasRef.current;
      if (canvas) {
         const ctx = canvas.getContext("2d");
         const dpr = window.devicePixelRatio || 1; // Get the device pixel ratio for high-DPI screens
   
         // Set original width and height of your design
         const originalWidth = 330;
         const originalHeight = 410;
   
         // Get scale factor to maintain aspect ratio
         const scaleX = canvas.getBoundingClientRect().width / originalWidth;
         const scaleY = canvas.getBoundingClientRect().height / originalHeight;
         const scale = Math.min(scaleX, scaleY);
   
         // Set canvas resolution (internal pixels)
         canvas.width = originalWidth * scale * dpr;
         canvas.height = originalHeight * scale * dpr;
   
         // Set the CSS size (what you see)
         canvas.style.width = `${originalWidth * scale}px`;
         canvas.style.height = `${originalHeight * scale}px`;
   
         // Scale the context for high-DPI rendering
         ctx!.scale(scale * dpr, scale * dpr);
   
         // Clear canvas
         ctx!.clearRect(0, 0, canvas.width, canvas.height);
   
         // Draw the notes
         for (const note of Notes) {
            note.draw(ctx!, false);
         }
         for (const note of AutoPath) {
            const note1= new Note(note.num);
            note1.isClicked=note.isClicked;
            note1.success=note.success
            note1.draw(ctx!, false);
         }
   
         const catmullRom = (
            p0: Note | { x: number; y: number }|
            {
               isClicked:boolean;
               num:number;
               x:number;
               y:number;
               success:boolean;
            },
            p1: Note | { x: number; y: number }|
            {
               isClicked:boolean;
               num:number;
               x:number;
               y:number;
               success:boolean;
            },
            p2: Note|
            {
               isClicked:boolean;
               num:number;
               x:number;
               y:number;
               success:boolean;
            },
            p3: Note | { x: number; y: number }|
            {
               isClicked:boolean;
               num:number;
               x:number;
               y:number;
               success:boolean;
            },
            t: number,
         ) => {
            const t2 = t * t;
            const t3 = t2 * t;
            return {
               x: 0.5 *
                  ((2 * p1.x) + (-p0.x + p2.x) * t +
                     (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
                     (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3),
               y: 0.5 *
                  ((2 * p1.y) + (-p0.y + p2.y) * t +
                     (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
                     (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3),
            };
         };
         const start = Note.Position[startPosition + 1];
         ctx!.lineCap = "round";
         ctx!.strokeStyle = Note.stroke;
         ctx!.beginPath();
         ctx!.arc(start.x + 7.5, start.y + 7.5, 3, 0, Math.PI * 2);
         ctx!.moveTo(start.x + 7.5, start.y + 7.5);
         if (AutoPath.length > 2) {
            const p0 = AutoPath[1];
            const p1 = AutoPath[2];
            const p3 = AutoPath[AutoPath.length - 1];
   
            for (let t = 0; t <= 1; t += 0.03) {
               const p = catmullRom(start, start, p0, p1, t);
               ctx!.lineTo(p.x + 7.5, p.y + 7.5);
            }
   
            if (AutoPath.length === 3) {
               for (let t = 0; t <= 1; t += 0.03) {
                  const p = catmullRom(start, p0, p1, p1, t);
                  ctx!.lineTo(p.x + 7.5, p.y + 7.5);
               }
            } else if (AutoPath.length === 4) {
               for (let t = 0; t <= 1; t += 0.03) {
                  const p = catmullRom(start, p0, p1, p3, t);
                  ctx!.lineTo(p.x + 7.5, p.y + 7.5);
               }
               for (let t = 0; t <= 1; t += 0.03) {
                  const p = catmullRom(p0, p1, p3, p3, t);
                  ctx!.lineTo(p.x + 7.5, p.y + 7.5);
               }
            } else {
               for (let t = 0; t <= 1; t += 0.03) {
                  const p = catmullRom(
                     start,
                     AutoPath[1],
                     AutoPath[2],
                     AutoPath[3],
                     t,
                  );
                  ctx!.lineTo(p.x + 7.5, p.y + 7.5);
               }
               for (let i = 2; i < AutoPath.length - 2; i++) {
                  for (let t = 0; t <= 1; t += 0.01) {
                     const p = catmullRom(
                        AutoPath[i - 1],
                        AutoPath[i],
                        AutoPath[i + 1],
                        AutoPath[i + 2],
                        t,
                     );
                     ctx!.lineTo(p.x + 7.5, p.y + 7.5);
                  }
               }
               for (let t = 0; t <= 1; t += 0.03) {
                  const p = catmullRom(
                     AutoPath[AutoPath.length - 3],
                     AutoPath[AutoPath.length - 2],
                     AutoPath[AutoPath.length - 1],
                     AutoPath[AutoPath.length - 1],
                     t,
                  );
                  ctx!.lineTo(p.x + 7.5, p.y + 7.5);
               }
            }
            ctx!.moveTo(p3.x + 8.5, p3.y + 8.5);
            ctx!.arc(p3.x + 8.5, p3.y + 8.5, 3, 0, Math.PI * 2);
         }
         else if (AutoPath.length == 2) {
            const p0 = AutoPath[1];
   
            for (let t = 0; t <= 1; t += 0.03) {
               const p = catmullRom(start, start, p0, p0, t);
               ctx!.lineTo(p.x + 7.5, p.y + 7.5);
            }
            ctx!.moveTo(p0.x + 8.5, p0.y + 8.5);
            ctx!.arc(p0.x + 8.5, p0.y + 8.5, 3, 0, Math.PI * 2);
         }
   
         ctx!.stroke();
      }
   })
   
   return (
      <>
         <div id="auto">
            <div id="svg-border">
               {alliance
                  ? (
                     <svg
                        id="svg"
                        viewBox="0 0 327 233"
                        fill="none"
                        className="flipped"
                     >
                        <path
                           d="M323.998 3.26295H213.758M3.38953 3.26295H115.292M115.292 3.26295L107.468 13.4348L157.923 96.7377H172.594L221.094 13.4348L213.758 3.26295M115.292 3.26295H213.758M3.38953 104.59H19.821V158.971M19.821 229.978V158.971M19.821 158.971H292.309M65.7899 229.978L87.6985 196.528H127.408L146.578 229.978"
                           stroke="#B54545"
                           strokeWidth="6"
                           strokeLinecap="round"
                           strokeLinejoin="round"
                           fill="none"
                        />
                        <path
                           d="M251.232 229.784L293.093 158.776H321.261L280.965 229.784"
                           stroke="#3F82C6"
                           strokeWidth="6"
                           strokeLinecap="round"
                           strokeLinejoin="round"
                        />
                     </svg>
                  )
                  : (
                     <svg id="svg" viewBox="0 0 327 233" fill="none">
                        <path
                           d="M323.998 3.26295H213.758M3.38953 3.26295H115.292M115.292 3.26295L107.468 13.4348L157.923 96.7377H172.594L221.094 13.4348L213.758 3.26295M115.292 3.26295H213.758M3.38953 104.59H19.821V158.971M19.821 229.978V158.971M19.821 158.971H292.309M65.7899 229.978L87.6985 196.528H127.408L146.578 229.978"
                           stroke="#3F82C6"
                           strokeWidth="6"
                           strokeLinecap="round"
                           strokeLinejoin="round"
                        />
                        <path
                           d="M251.232 229.784L293.093 158.776H321.261L280.965 229.784"
                           stroke="#B54545"
                           strokeWidth="6"
                           strokeLinecap="round"
                           strokeLinejoin="round"
                        />
                     </svg>
                  )}

               <canvas
                  id="canvas"
                  ref={canvasRef}
                  className={alliance ? "flipped" : ""}
               >
               </canvas>
            </div>
         </div>
      </>
   )
}
export default DataAnalysisAuto;