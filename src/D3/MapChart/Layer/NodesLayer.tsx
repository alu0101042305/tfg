import React from 'react'
import {Layer} from './Layer'
import { Contaminante, getColor } from '../../../assets/Contaminante'
import * as d3 from 'd3'

export const NodesLayer = (props: {
  projection?,
  data: {x: number, y: number}[],
  transform?,
  hidden?: boolean
  collide?: boolean,
  contaminante: Contaminante
}) => {

  function node(g) {
    var circle = g.select('circle')
    if(circle.empty())
      circle = g.append('circle')
    circle
      .attr("stroke", "black")
      .style("stroke-width", "1px")
      .attr('fill', d => getColor(d.value, props.contaminante))

    var text = g.select('text')
    if(text.empty()) {
      text = g.append('text')
    }
    text
      .attr("fill", "black")
      .text(d => d.value)
      .call(setTextBounds, circle)
  }

  function setTextBounds(texts, circles) {
    const bounds = texts.nodes().map(text => {
      const {width, height} = text.getBBox()
      return {width, height}
    })
    const max = d3.max(circles.data(), (d: {value: number}) => d.value)
    texts
      .attr('x', (_, i) => -bounds[i].width / 2)
      .attr('y', (_, i) => bounds[i].height / 4)
    circles
      .attr('r',  (n, i) => {
        n.radius = bounds[i].width / 2 + 4
        return n.radius
      })
  }

  return (
    <Layer {...props}
      d3Func={node} />
  )
}