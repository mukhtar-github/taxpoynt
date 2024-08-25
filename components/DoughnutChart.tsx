"use client"

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export interface TaxType {
  name: string;
  value: number;
}

// Update the component props if necessary
interface DoughnutChartProps {
  taxTypes: TaxType[];
  size: number;
}

const DoughnutChart = ({ taxTypes, size }: DoughnutChartProps) => {
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

  return (
    <div className="doughnut-chart-container" style={{ width: `${size}px`, height: `${size}px` }}>
      <Doughnut 
        data={data}
        options={{
          cutout: '70%',
          plugins: {
            legend: {
              display: true,
              position: 'bottom' as const,
              labels: {
                boxWidth: 12,
                padding: 15
              }
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
          responsive: true,
          maintainAspectRatio: true
        }} 
      />
    </div>
  );
}

export default DoughnutChart;