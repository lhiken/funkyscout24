import { useEffect, useRef, useState } from "react";
import "../styles/canvas.css";
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

const Auto = (
   { alliance, startPosition, AutoPath, setAutoData }: {
      alliance: boolean;
      startPosition: number; //-1, 0, 1 for left, center, right
      AutoPath: Note[];
      setAutoData: React.Dispatch<React.SetStateAction<Note[]>>;
   },
) => {
   if (alliance == true){
      startPosition=-startPosition;
   }


   const canvasRef = useRef<HTMLCanvasElement>(null);
   const [active, setActive] = useState(true);

   useEffect(() => {
      for (const note of Notes) {
         note.isClicked = false;
      }
   }, [])

   const handleCanvasClick = (event: React.MouseEvent) => {
      const canvas = canvasRef.current;
      if (canvas && !active) {
         const rect = canvas.getBoundingClientRect();
         const x = event.clientX - rect.left;
         const y = event.clientY - rect.top;

         for (const note of Notes) {
            const clicked = alliance
               ? x <= 325 - note.x + 15 &&
                  x >= 325 - note.x - Note.width - 15 && y >= note.y - 15 &&
                  y <= note.y + Note.width + 15
               : x >= note.x - 15 && x <= note.x + Note.width + 15 &&
                  y >= note.y - 15 && y <= note.y + Note.width + 15;

            if (!note.isClicked && clicked) {
               note.isClicked = true;
               setAutoData((prev) => [...prev, note]);
               setActive(true);
               break;
            }
         }
      } else {
         //('error', 'Score piece first!')
      }
   };

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
            note.draw(ctx!,true);
         }

         const catmullRom = (
            p0: Note | { x: number; y: number } ,
            p1: Note | { x: number; y: number },
            p2: Note,
            p3: Note | { x: number; y: number },
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
         const start = Note.Position[startPosition+1];
         ctx!.lineCap = "round";
         ctx!.strokeStyle = Note.stroke;
         ctx!.beginPath();
         ctx!.arc(start.x+7.5,start.y+7.5,3,0,Math.PI*2);
         ctx!.moveTo(start.x+7.5,start.y+7.5);
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
            ctx!.moveTo(p3.x+8.5,p3.y+8.5);
            ctx!.arc(p3.x+8.5,p3.y+8.5,3,0,Math.PI*2);
         }
         else if (AutoPath.length==2){
            const p0 = AutoPath[1];
            
            for (let t = 0; t <= 1; t += 0.03) {
               const p = catmullRom(start, start, p0, p0, t);
               ctx!.lineTo(p.x + 7.5, p.y + 7.5);
            }
            ctx!.moveTo(p0.x+8.5,p0.y+8.5);
            ctx!.arc(p0.x+8.5,p0.y+8.5,3,0,Math.PI*2);
         }
         
         
         ctx!.stroke();
      }

      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [active]);

   const handleScore = () => {
      if (active) {
         setActive(false);
         setAutoData((prev) => {
            const updatedPath = [...prev];
            updatedPath[updatedPath.length - 1].isClicked = true;
            updatedPath[updatedPath.length - 1].success = true;
            return updatedPath;
         });
         setUndoActive(true);
         //('success', 'Logged scored note!')
      } else {
         //('error', 'Select path first!')
      }
   };

   const handleMiss = () => {
      if (active) {
         setActive(false);
         setAutoData((prev) => {
            const updatedPath = [...prev];
            updatedPath[updatedPath.length - 1].isClicked = true;
            updatedPath[updatedPath.length - 1].success = false;
            return updatedPath;
         });
         setUndoActive(true);
         //('success', 'Logged missed note!')
      } else {
         //('error', 'Select path first!')
      }
   };
   const [undoActive, setUndoActive] = useState(false);

   const handleUndo = () => {
      if (AutoPath.length>1 && undoActive ) {
         if (active) {
            const n = AutoPath[AutoPath.length - 1];
            setAutoData((prev) => {
               const updatedPath = [...prev];
               for (const note of Notes) {
                  if (n.num === note.num) {
                     note.isClicked = false;
                     break;
                  }
               }
               updatedPath.pop();
               return updatedPath;
            });
            setActive(false);
            //("success", "Undid path selection!");
         } else {
            setAutoData((prev) => {
               const updatedPath = [...prev];
               updatedPath[updatedPath.length - 1].isClicked = true;
               updatedPath[updatedPath.length - 1].success = undefined;
               return updatedPath;
            });
            setActive(true);
            //("success", "Undid note scoring!");
         }
         
      } 
      else if (AutoPath.length==1 && AutoPath[0].isClicked){
         setAutoData((prev) => {
            const updatedPath = [...prev];
            updatedPath[updatedPath.length - 1].isClicked = true;
            updatedPath[updatedPath.length - 1].success = undefined;
            return updatedPath;
         });
         setActive(true);
         setUndoActive(false);
      }
      else {
         //("error", "Nothing to undo.");
      }
   };

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
                  className={undoActive ? "active" : "inactive"}
                  onClick={handleUndo}
               >
                  <i className="fa-solid fa-rotate-left"></i>
               </button>
            </div>
         </div>
      </>
   );
};

export default Auto;
