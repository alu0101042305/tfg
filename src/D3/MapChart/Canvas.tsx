import React from 'react'
import * as d3 from 'd3'

const Canvas = React.memo((props: {
  transform,
  width: number,
  height: number,
  projection,
  geo,
  color?: string
}) => {
  
  const color = props.color || 'steelblue'

  var canvas

  const path2D = React.useMemo(() => {
    const path = new Path2D()
    d3.geoPath()
      .projection(props.projection)
      .context(path as any)(props.geo)
    return path
  }, [props.projection, props.geo])

  React.useEffect(() => {
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, props.width, props.height)
    ctx.resetTransform()
    ctx.translate(props.transform.x, props.transform.y)
    ctx.scale(props.transform.k, props.transform.k)
    ctx.fillStyle = color
    ctx.fill(path2D)
  })

  return (
    <canvas
      width={props.width}
      height={props.height}
      ref={n => canvas = n} />
  )
})

export default Canvas;