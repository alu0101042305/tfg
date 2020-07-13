import React from 'react'
import * as d3 from 'd3'

var projection, path

function recalculatePath(pro, geo){
  console.log('Recalculating path')
  projection = pro
  path = new Path2D()
  d3.geoPath()
    .projection(projection)
    .context(path as any)(geo)
  return path
}

function getPath(p, geo) {
  if(!projection || projection != p)
    return recalculatePath(p, geo)
  return path
}

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
    return getPath(props.projection, props.geo)
  }, [props.projection, props.geo])

  React.useEffect(() => {
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, props.width, props.height)
    ctx.resetTransform()
    ctx.translate(props.transform.x, props.transform.y)
    ctx.scale(props.transform.k, props.transform.k)
    ctx.fillStyle = color
    ctx.strokeStyle = 'lightgray'
    ctx.lineWidth = '0.05'
    ctx.fill(path2D)
    ctx.stroke(path2D)
  })

  return (
    <canvas
      width={props.width}
      height={props.height}
      ref={n => canvas = n} />
  )
})

export default Canvas;