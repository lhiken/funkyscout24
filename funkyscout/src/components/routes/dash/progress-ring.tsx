import "./progress-ring.css";

const ProgressRing = (
   { stroke, radius, progress, label}: {
      stroke: number;
      radius: number;
      progress: number;
      label: string;
   },
) => {
   stroke *= 16;
   radius *= 16;

   const normalizedRadius = radius - stroke * 0.5;
   const circumference = normalizedRadius * 2 * Math.PI;
   const strokeDashoffset = circumference - progress * circumference;

   return (
      <>
         <svg
            height={radius * 2}
            width={radius * 2}
            className="progress-ring"
            viewBox={`0 0 ${radius * 2} ${radius * 2}`}  
         >
            <defs>
               <filter id="inset-shadow">
                  <feOffset dx="0" dy="0" />
                  <feGaussianBlur stdDeviation="3" result="offset-blur" />
                  <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse" />
                  <feFlood floodColor="var(--progress-ring-flood)" floodOpacity="1" result="color" />
                  <feComposite operator="in" in="color" in2="inverse" result="shadow" />
                  <feComposite operator="over" in="shadow" in2="SourceGraphic" />
               </filter>
            </defs>
            <circle
               className="progress-ring-circle"
               stroke="var(--accent)"
               strokeLinecap="round"
               fill="transparent"
               strokeWidth={stroke}  
               strokeDasharray={circumference + "px " + circumference} 
               style={{ strokeDashoffset: strokeDashoffset }}  
               r={normalizedRadius}  
               cx={radius}  
               cy={radius} 
            />
            <text
               x="50%"
               y="50%"
               textAnchor="middle"
               dy="0px"  
               fill="var(--light-text)"
               className="progress-text-header"
            >
               {Math.round(progress * 100)}%
            </text>
            <text
               x="50%"
               y="50%"
               textAnchor="middle"
               dy="21.6px" 
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
               strokeWidth={stroke}  
               r={normalizedRadius} 
               cx={radius}
               cy={radius}
            />
         </svg>
      </>
   );
};

export default ProgressRing;
