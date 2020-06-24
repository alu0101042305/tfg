import React from 'react'
import {Layer} from './Layer'
import {Fabricas} from '../../../assets/Fabrica'
import * as d3 from 'd3'

const FACTORY_WIDTH = 30;

export const FabricasLayer = (props: {
  projection?,
  transform?,
  hidden?: boolean
  collide?: boolean
  onMouseEnter,
  onMouseLeave
}) => {

  function Fabrica(g) {
    var img = g.select('image')
    img = img.empty() ? g.append('image') : img
    img
      .attr('href', 'img/factory.png')
      .attr('width', FACTORY_WIDTH)
      .attr('height', FACTORY_WIDTH)
      .attr('x', -FACTORY_WIDTH / 2)
      .attr('y', -FACTORY_WIDTH / 2)
      .style('cursor', 'default')
      .on('mouseenter', d => {
        props.onMouseEnter(d, d3.event.target)
      })
      .on('mouseleave', props.onMouseLeave)
  }

  return (
    <Layer {...props}
      radius={FACTORY_WIDTH / 2}
      data={Fabricas}
      d3Func={Fabrica} />
  )
}