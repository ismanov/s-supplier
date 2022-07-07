import { formatPriceProduct } from "helpers/format-price";

export const chartConfig = {
  xField: 'item',
  yField: 'value',
  xAxis: {
    tickCount: 5,
    grid: { line: { style: { stroke: '#ececec', lineWidth: 2 } } },
    line: { style: { stroke: '#ececec', lineWidth: 2 } }
  },
  yAxis: {
    label: {
      formatter: function formatter(value) {
        return formatPriceProduct(value);
      },
    },
    line: { style: { stroke: '#ececec', lineWidth: 2 } }
  },
  legend: false,
  seriesField: 'totalCount',
  color: '#009f3c',
  point: {
    size: 5,
    shape: 'circle',
    style: {
      fill: 'white',
      stroke: '#009f3c',
      lineWidth: 2,
    },
  },
  tooltip: {
    formatter: (datum) => {
      return {
        name: `
          <span class="chart-tooltip-total">
            ${formatPriceProduct(datum.value)} сум
          </span>
          <span class="chart-tooltip-qty">
            Заказы: ${datum.totalCount}
          </span>
        `
      };
    },
  },
  areaStyle: function areaStyle() {
    return {
      fill: 'l(270) 0:#d8f0e1 0.5:#d8f0e1 1:#009f3c',
    };
  },
};