import React from 'react'
import D3Component from '../D3Component'
import LineChart from './LineChart'
import Contaminante from '../../assets/Contaminante'

function Component(props: {
  zone?: string,
  start_date: Date,
  end_date: Date,
  contaminante: Contaminante
}) {

  const lineChart = new LineChart()

  function query(): string{
    return `select mean(value)
            from ${props.contaminante.db_name}
            group by time(8h)
            where time >= ${props.start_date} and time <= ${props.end_date}` +
            (props.zone ? `and 'zone' = "${props.zone}"` : '')
    // OJO que esto no está revisado prob. estén mal alguans comillas o algo
  }

  function loadData() {
    return new Promise(resolve => {
      fetch('/consult', {
        method: 'POST',
        body: query()
      }).then(res => res.json().then(json => {
        console.log(json)
        //lineChart.setData(JSON.parse(json))
        resolve(null)
      }))
    })
  }

  return (
    <D3Component d3={lineChart} load_async={loadData}/>
  )

}

export default Component;