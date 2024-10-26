import { Line } from "react-chartjs-2";
import { Tables } from "../../../../utils/database/database.types";
import {
   CategoryScale,
   Chart as ChartJS,
   ChartOptions,
   Legend,
   LinearScale,
   LineElement,
   PointElement,
   Title,
   Tooltip,
} from "chart.js";

ChartJS.register(
   CategoryScale,
   LinearScale,
   PointElement,
   LineElement,
   Title,
   Tooltip,
   Legend,
);

const GraphsTab = ({ data }: { data: Tables<"match_data">[] }) => {
   if (!data || data.length == 0) {
      return <div className="data-tab">No data</div>;
   }

   const overallChartData = {
      labels: data.map((item) => item.match), 
      datasets: [
         {
            label: "Pieces Scored",
            data: data.map((item) => item.amp + item.speaker), 
            borderColor: "#CDA745",
            backgroundColor: "#CDA745",
            tension: 0.4, 
         },
      ],
   };

   const accuracyChartData = {
      labels: data.map((item) => item.match), 
      datasets: [
         {
            label: "Accuracy%",
            data: data.map((
               item,
            ) => (((1 - item.miss / (item.amp + item.speaker + item.miss)) *
               100).toFixed(1))
            ), 
            borderColor: "#CDA745",
            backgroundColor: "#CDA745",
            tension: 0.4, 
         },
      ],
   };

   const overallChartOptions: ChartOptions<"line"> = {
      responsive: true,
      plugins: {
         legend: {
            display: false, 
         },
         title: {
            display: true,
            text: "Teleop Performance", 
            font: {
               family: "Poppins", 
               size: 14,
               weight: "normal",
            },
            color: "#CDA745",
         },
         tooltip: {
            bodyFont: {
               family: "Poppins",
            },
         },
      },
      scales: {
         x: {
            ticks: {
               font: {
                  family: "Poppins",
               },
            },
            grid: {
               color: "rgba(200, 200, 200, 0.2)",
            },
         },
         y: {
            ticks: {
               maxTicksLimit: 3, // Limit the number of ticks displayed to 5
               stepSize: 5, // Set step size to control the interval between ticks
               font: {
                  family: "Poppins",
                  // Font family for y-axis labels
               },
            },
            grid: {
               color: "rgba(150, 150, 150, 0.2)",
            },
         },
      },
   };

   const accuracyChartOptions: ChartOptions<"line"> = {
      responsive: true,
      plugins: {
         legend: {
            display: false, // Completely hides the legend
         },
         title: {
            display: true,
            text: "Accuracy", // Title text in lowercase
            font: {
               family: "Poppins", // Font family set to "Poppins"
               size: 14,
               weight: "normal",
            },
            color: "#CDA745",
         },
         tooltip: {
            bodyFont: {
               family: "Poppins", // Font family for tooltips
            },
         },
      },
      scales: {
         x: {
            ticks: {
               font: {
                  family: "Poppins",
                  // Font family for x-axis labels
               },
            },
            grid: {
               color: "rgba(200, 200, 200, 0.2)",
            },
         },
         y: {
            min: 0, // Adjust based on your data range
            max: 100, // Adjust based on your data rang
            ticks: {
               maxTicksLimit: 3, // Limit the number of ticks displayed to 5
               stepSize: 5, // Set step size to control the interval between ticks
               font: {
                  family: "Poppins",
                  // Font family for y-axis labels
               },
            },
            grid: {
               color: "rgba(150, 150, 150, 0.2)",
            },
         },
      },
   };

   return (
      <div className="data-tab">
         <Line
            data={overallChartData}
            options={overallChartOptions}
            key={data.length + "amp"}
         />
         <Line
            data={accuracyChartData}
            options={accuracyChartOptions}
            key={data.length + "amp"}
         />
      </div>
   );
};

export default GraphsTab;
