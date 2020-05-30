import React from 'react'
import * as d3 from 'd3'
import { Transform, Node } from './LayerTypes'

export const Layer = React.memo(function <T extends Node>(props: {
  projection?,
  d3Func(number: d3.Selection<Element, T, Element, any>): void,
  data: T[],
  transform?: Transform,
  radius?: number,
  hidden?: boolean
  collide?: boolean
}) {

  var g: Element

  const nodes = React.useMemo(() => {
    return props.data.map(d => {
      const [x, y] = props.projection([d.x, d.y])
      return {
        ...d,
        x: x * props.transform.k,
        y: y * props.transform.k 
      }
    })
  }, [props.data, props.projection, props.transform.k, props.collide])

  const forceSimulation = React.useMemo(() =>
    d3.forceSimulation()
      .force('collide', d3.forceCollide().radius((node: any) => node.radius || props.radius).strength(0.3))
      .stop(), [])

  React.useEffect(() => {
    d3.select(g).selectAll('g')
      .data(props.data)
      .join('g')
      .call(props.d3Func)
  }, [props.data])

  React.useEffect(() => {
    const d3_g = d3.select(g).selectAll('g')

    function setPos(){
      d3_g
        .data(nodes)
        .attr('transform', (node: any) => `translate(
          ${node.x + props.transform.x},
          ${node.y + props.transform.y})`)
    }
      
    if(props.collide){
      forceSimulation.nodes(nodes)
        .on('tick', setPos)
        .alpha(1)
        .restart()
    }
    else {
      forceSimulation.stop()
      setPos()
    }
  })

  return <g
            visibility={props.hidden ? 'hidden': 'visible'}
            ref={n => g = n}/>
})

