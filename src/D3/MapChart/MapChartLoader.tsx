import React from 'react'
import Loading from '../Loading'
import {useLoading} from '../hooks'
import MapChart from './MapChart'
import * as d3 from 'd3'
import { FabricasLayer } from './Layer/FabricasLayer'
import { Contaminante } from '../../assets/Contaminante'
import locations from './locations.json'
import {NodesLayer} from './Layer/NodesLayer'
import FabricaPopOver from './FabricaPopOver'
import { Fabricas, Fabrica } from '../../assets/Fabrica'

function loadData(contaminante: Contaminante) {
    return new Promise(resolve => {
      fetch('/' + contaminante.id).then(res => res.json().then(obj => {
        const points = locations.points.map(e => {
          return {
            x: e.longitude,
            y: e.latitude,
            value: obj[e.name]
          }
        }).filter(e => (e.value && e.value > -1))
        resolve(points)
      }))
    })
}

function loadGeo() {
  return new Promise(resolve => {
    d3.json("/json/grid.json").then(json => {
      resolve(json)
    })
  })
}

export const MapChartLoader = React.memo((props: {
  contaminante: Contaminante,
  layersProps: {
    collide?: boolean,
    hidden?: boolean
  }[]
}) => {
  const [data, isLoadingData] = useLoading<any>(loadData, props.contaminante)
  const [geojson, isLoadingGeo] = useLoading(loadGeo)
  const [pop, setPop] = React.useState({anchor: null, fabrica: Fabricas[0]})

  if(isLoadingGeo || isLoadingData) 
    return <Loading />

  function onFabricEnter(fabrica: Fabrica, anchor: Element){
    setPop({fabrica, anchor})
  }

  function onFabricLeave() {
    setPop({
      fabrica: Fabricas[0],
      anchor: null
    })
  }
  
  return (
    <React.Fragment>
      <FabricaPopOver {...pop} />
      <MapChart geo={geojson}>
        <FabricasLayer onMouseEnter={onFabricEnter} onMouseLeave={onFabricLeave} {...props.layersProps[0]} />
        <NodesLayer data={data} contaminante={props.contaminante} {...props.layersProps[1]} />
      </MapChart>
    </React.Fragment>
  )
  
})