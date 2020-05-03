import React from 'react'
import D3Component from '../D3Component'
import LineChart from './LineChart'
import {Contaminante} from '../../assets/Contaminante'
import {Point} from './Types'

function Component(props: {
  zones: string[],
  start_date: Date,
  end_date: Date,
  contaminante: Contaminante,
  group_by: number
}) {

  const lineChart = new LineChart()

  function parse(date: Date): string {
    return date.toISOString()
  }

  function zonesQuery() {
    const {zones} = props
    if(zones.length <= 0) return '';
    var string = `and ( "zone" = '${zones[0]}'`
    zones.slice(1).forEach(e => {
      string += `or "zone" = '${e}'`
    })
    return string + ')'
  }

  function query(): string{
    return `select mean("value")
            from "${props.contaminante.db_name}"
            where time >= '${parse(props.start_date)}' and time <= '${parse(props.end_date)}'` +
            zonesQuery() +
            `group by ${props.zones.length > 0 ? `"zone",` : ''} time(${props.group_by}h)`
  }

  function loadData() {
    return new Promise(resolve => {
      fetch('/consult', {
        method: 'POST',
        body: query()
      }).then(res => res.json().then(json => {
        const points: Point[][] = json.groups.map(e => e.rows.map(r => {
          return ({
            date: new Date(r.time),
            value: r.mean
          })
        } ))
        lineChart.setData({
          points,
          contaminante: props.contaminante
        })
        resolve(null)
      }))
    })
  }

  return (
    <D3Component d3={lineChart} load_async={loadData}/>
  )
}

export default Component;