import React, { ReactNode, ReactElement } from 'react'
import * as hooks from '../hooks'
import * as d3 from 'd3'
import Canvas from './Canvas'

var projection, width, height

function newProjection(w: number, h: number, geo){
  console.log('New Projection')
  width = w
  height = h
  projection = d3.geoMercator()
    .fitSize([w, h], geo)
  return projection
}

function getProjection(w, h, geo) {
  if(!projection)
    return newProjection(w, h, geo)
  if(w == 0 || h == 0)
    return projection
  if(w != width || h != height)
    return newProjection(w, h, geo)
  return projection
}

const MapChart = React.memo((props: {
  geo,
  children?: ReactNode
}) => {
  var svg
  const ref = React.useRef(null)
  const [width, height] = hooks.useElementSize(ref)
  const [transform, setTransform] = React.useState({k: 1, x: 0, y: 0})

  const projection = React.useMemo(() => (
    getProjection(width, height, props.geo)
  ), [width, height, props.geo])

  React.useEffect(() => {
    const zoom = d3.zoom()
      .scaleExtent([1, 64])
      .on('zoom', () => {
        setTransform(d3.event.transform)
      })
    const d3_svg = d3.select(svg)
      .call(zoom)
      .on('click', (e) => {
        d3_svg.transition().duration(750).call(zoom.transform, d3.zoomIdentity);
      })
  }, [])

  return (
    <div className='mapChart' ref={ref}>
      <Canvas {...{
        width, height, projection, transform,
        geo: props.geo
      }} />
      <svg ref={n => svg = n} {...{width, height}}>
        {
          React.Children.map(props.children, (node: ReactElement) => {
            return React.cloneElement(node, {...node.props, projection, transform, setTransform})
          })
        }
      </svg>
    </div>
  )
})

export default MapChart;