import React from 'react'
import D3Component from '../D3Component'
import MapChart from './MapChart'
import * as d3 from 'd3'
import locations from './locations.json'

var geojson: object;

function MapChartComp(props) {

  const map = new MapChart()

  function loadData(): Promise<any> {
    if(!geojson) {
      return Promise.all([loadGeojson(), loadPoints()])
    } else {
      return loadPoints()
    }
  }

  function loadGeojson(): Promise<null> {
    return new Promise(resolve => {
      d3.json("/json/canary.json").then(json => {
        map.setGeojson(json)
        resolve(null)
      })
    })
  }

  function loadPoints(): Promise<null> {
    return new Promise(resolve => {
      fetch('/' + props.contaminante.id).then(res => res.json().then(obj => {
        const points = locations.points.map(e => {
          return {
            pos: [e.longitude, e.latitude] as [number, number],
            value: obj[e.name]
          }
        }).filter(e => (e.value && e.value > -1))
        map.setData({
          points,
          contaminante: props.contaminante
        })
        resolve(null)
      }))
    })
  }

  return (
    <D3Component d3={map} load_async={loadData}/>
  )

}

export default MapChartComp;