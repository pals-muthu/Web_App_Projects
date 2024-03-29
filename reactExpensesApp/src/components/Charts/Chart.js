import React from 'react';

import ChartBar from './ChartBar';
import './Chart.css';

const Chart = (props) => {

  const valuePoints = props.dataPoints.map(dataPoint => (dataPoint.value));
  const maxValue = Math.max(...valuePoints);

  return (<div className='chart'>
    {props.dataPoints.map(dataPoint => <ChartBar value={dataPoint.value} maxValue={maxValue} label={dataPoint.label} key={dataPoint.label}/>)}
  </div>)
}

export default Chart;