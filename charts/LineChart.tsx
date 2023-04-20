"use client";
import { useMemo } from "react";
import "chart.js/auto";
import { Line } from "react-chartjs-2";

const dataConfig = {
  labels: [],
  datasets: [
    // {
    //   label: "Stacked ETH",
    //   fill: false,
    //   lineTension: 0.1,
    //   backgroundColor: "rgba(255, 99, 132,0.4)",
    //   borderColor: "rgba(255, 99, 132, 1)",
    //   pointStyle: "rect",
    //   borderDash: [],
    //   borderDashOffset: 0.0,
    //   pointBorderColor: "rgba(255, 99, 132,1)",
    //   pointBackgroundColor: "#fff",
    //   pointBorderWidth: 1,
    //   pointHoverRadius: 5,
    //   pointHoverBackgroundColor: "rgba(255, 99, 132,1)",
    //   pointHoverBorderColor: "rgba(220,220,220,1)",
    //   pointHoverBorderWidth: 2,
    //   pointRadius: 1,
    //   pointHitRadius: 10,
    //   data: [],
    // },
    {
      label: "Stacked StEth",
      fill: false,
      lineTension: 0.1,
      pointStyle: "rect",
      backgroundColor: "rgba(75,192,192,0.4)",
      borderColor: "rgba(75, 192, 192, 1)",
      borderDash: [],
      borderDashOffset: 0.0,
      pointBorderColor: "rgba(75,192,192,1)",
      pointBackgroundColor: "#fff",
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: "rgba(75,192,192,1)",
      pointHoverBorderColor: "rgba(220,220,220,1)",
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data: [],
    },
    {
      label: "Stacked REth",
      fill: false,
      lineTension: 0.1,
      pointStyle: "rect",
      backgroundColor: "rgba(255, 206, 86,0.4)",
      borderColor: "rgba(255, 206, 86, 1)",
      borderDash: [],
      borderDashOffset: 0.0,
      pointBorderColor: "rgba(75,192,192,1)",
      pointBackgroundColor: "#fff",
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: "rgba(255, 206, 86,1)",
      pointHoverBorderColor: "rgba(220,220,220,1)",
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data: [],
    },
  ],
};

const LineChart = (data: any) => {
  const chartData = useMemo(() => {
    const internalChartData = dataConfig;
    internalChartData.labels = data.data.timestamps;
    internalChartData.datasets.forEach((dataset, index) => {
      dataset.data = data.data.amounts[index];
    });
    return internalChartData;
  }, [data]);

  return (
    <Line
      data={chartData}
      title={data.title}
      options={{
        maintainAspectRatio: false,
        responsive: true,
      }}
    />
  );
};

export default LineChart;
