"use client"

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChart = ({ taxTypes }: DoughnutChartProps) => {
  const data = {
    labels: ['Income', 'Expenses', 'Tax Liability'],
    datasets: [
      {
        label: 'Budget Overview',
        data: [30000, 15000, 5000],
        backgroundColor: ['#0747b6', '#2265d8', '#2f91fa'],
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
        },
      },
    }} 
  />;
}

export default DoughnutChart
