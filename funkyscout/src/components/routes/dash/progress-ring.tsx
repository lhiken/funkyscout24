import "./progress-ring.css";

const ProgressRing = (
   { stroke, radius, progress, label}: {
      stroke: number;
      radius: number;
      progress: number;
      label: string;
   },
) => {
   const normalizedRadius = radius - stroke * 0.5;
   const circumference = normalizedRadius * 2 * Math.PI;
   const strokeDashoffset = circumference - progress * circumference + "rem";

   return (
      <>
         <svg
            height={radius * 2 + "rem"}
            width={radius * 2 + "rem"}
            className="progress-ring"
         >
            <defs>
               <filter id="inset-shadow">
                  <feOffset
                     dx="0"
                     dy="0"
                  />

                  <feGaussianBlur
                     stdDeviation="3"
                     result="offset-blur"
                  />

                  <feComposite
                     operator="out"
                     in="SourceGraphic"
                     in2="offset-blur"
                     result="inverse"
                  />

                  <feFlood
                     floodColor="black"
                     floodOpacity="01"
                     result="color"
                  />
                  <feComposite
                     operator="in"
                     in="color"
                     in2="inverse"
                     result="shadow"
                  />

                  <feComposite
                     operator="over"
                     in="shadow"
                     in2="SourceGraphic"
                  />
               </filter>
            </defs>
            <circle
               className="progress-ring-circle"
               stroke="var(--accent)"
               strokeLinecap="round"
               fill="transparent"
               strokeWidth={stroke + "rem"}
               strokeDasharray={circumference + "rem" + " " + circumference +
                  "rem"}
               style={{ strokeDashoffset }}
               r={normalizedRadius + "rem"}
               cx={radius + "rem"}
               cy={radius + "rem"}
            />
            <text
               x="50%"
               y="50%"
               textAnchor="middle"
               dy="0rem"
               fill="var(--light-text)"
               className="progress-text-header"
            >
               {Math.round(progress * 100)}%
            </text>
            <text
               x="50%"
               y="50%"
               textAnchor="middle"
               dy="1.35rem"
               fill="var(--dark-text)"
               className="progress-text"
            >
               {label}
            </text>
            <circle
               className="progress-ring-circle"
               stroke="var(--accent-dim)"
               strokeLinecap="round"
               fill="transparent"
               strokeWidth={stroke + "rem"}
               r={normalizedRadius + "rem"}
               cx={radius + "rem"}
               cy={radius + "rem"}
            />
         </svg>
      </>
   );
};

export default ProgressRing;
