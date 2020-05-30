import React, { ReactNode, ReactElement } from 'react'
import * as hooks from '../hooks'
import * as d3 from 'd3'
import Canvas from './Canvas'
import { FabricasLayer } from './Layer/FabricasLayer'

export default function MapChart(props: {
  geo,
  children?: ReactNode
}) {
  var svg
  const ref = React.useRef(null)
  const [width, height] = hooks.useElementSize(ref)
  const [transform, setTransform] = React.useState({k: 1, x: 0, y: 0})

  const projection = React.useMemo(() => (
    d3.geoMercator()
      .fitSize([width, height], props.geo as any)
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

  function zoomTo() {
    // this.svg.transition().duration(750).call(this.zoom.transform, d3.zoomIdentity
    //   .translate(- d.pos[0] * k + this.width / 2, - d.pos[1] * k + this.height / 2)
    //   .scale(k))
  }

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
}