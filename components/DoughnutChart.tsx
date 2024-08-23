"use client"

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

interface TaxType {
  name: string;
  value: number;
}

interface DoughnutChartProps {
  taxTypes: TaxType[];
}

const DoughnutChart = ({ taxTypes }: DoughnutChartProps) => {
  const data = {
    labels: taxTypes.map(tax => tax.name),
    datasets: [
      {
        label: 'Tax Breakdown',
        data: taxTypes.map(tax => tax.value),
        backgroundColor: ['#0747b6', '#2f91fa'],
        borderColor: ['#ffffff', '#ffffff'],
        borderWidth: 1,
      },
    ],
  };

  return <Doughnut 
    data={data}
    options={{
      cutout: '60%',
      plugins: {
        legend: {
          display: true,
          position: 'bottom' as const,
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              let label = context.label || '';
              if (label) {
                label += ': ';
              }
              if (context.parsed !== undefined) {
                label += new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(context.parsed);
              }
              return label;
            }
          }
        }
      },
    }} 
  />;
}

export default DoughnutChart;




// "use client"

// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
// import { Doughnut } from "react-chartjs-2";

// ChartJS.register(ArcElement, Tooltip, Legend);

// const DoughnutChart = ({ taxTypes }: DoughnutChartProps) => {
//   const data = {
//     labels: ['Income', 'Expenses', 'Tax Liability'],
//     datasets: [
//       {
//         label: 'Budget Overview',
//         data: [30000, 15000, 5000],
//         backgroundColor: ['#0747b6', '#2265d8', '#2f91fa'],
//       },
//     ],
//   };

//   return <Doughnut 
//     data={data}
//     options={{
//       cutout: '60%',
//       plugins: {
//         legend: {
//           display: true,
//         },
//       },
//     }} 
//   />;
// }

// export default DoughnutChart
