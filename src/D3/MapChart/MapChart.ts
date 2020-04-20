import * as d3 from 'd3'
import D3Element from "../D3Element";
import {card, setTextBounds} from './Card'
import {Data, Point} from './Types'

class MapChart implements D3Element{

  geojson: object;
  width: number
  height: number
  zoom = d3.zoom()
    .scaleExtent([1, 64])
    .on('zoom', () => this.setZoom(d3.event.transform))
  projection = d3.geoMercator()
  path = d3.geoPath()
  canvas = d3.create('canvas')
  svg = d3.create('svg')
    .on('click', this.svgClick.bind(this))
    .call(this.zoom)
  rects = this.svg.append('g').selectAll('rect')
  transform = {k: 1, x: 0, y: 0}
  path2D: Path2D
  data: Data
  originalPoints: [number, number][]
  
  // añade el canvas y el svg a node
  setParent(node: HTMLElement) {
    // Es importante añadir el SVG después del canvas,
    // porque los eventos de ratón se van a escuchar en el segundo
    node.append(this.canvas.node())
    node.append(this.svg.node())
    this.rects.selectAll('text')
      .call(setTextBounds)
  }

  setGeojson(geojson) {
    this.geojson = geojson
  }
  // evento que se dispara al hacer click
  svgClick() {
    this.svg.transition().duration(750).call(this.zoom.transform, d3.zoomIdentity);
  }

  // redimensiona el canvas
  resizeCanvas() {
    this.canvas
      .attr('height', this.height)
      .attr('width', this.width)

    this.path2D = new Path2D()
    this.path.projection(this.projection).context(this.path2D as any)
    this.path(this.geojson as any)
  }

  // redimensiona el svg
  resizeSVG() {
    this.svg
      .attr("width", this.width)
      .attr('height', this.height)
  }

  // redimensiona el compoenente
  resize(width: number, height: number) {
    this.width = width
    this.height = height
    this.projection.fitSize([this.width, this.height], this.geojson as any)
    this.data.points.forEach((e, i) => {
      e.pos = this.projection([this.originalPoints[i][0], this.originalPoints[i][1]])
    });
    this.resizeCanvas()
    this.resizeSVG()
  }

  // actualiza los datos del mapa
  setData(data: Data) {
    this.originalPoints = data.points.map(e => [e.pos[0], e.pos[1]])
    this.data = data
    this.rects = this.rects
      .data(this.data.points)
      .join('g')
      .call(card as any, data.contaminante)
  }

  // establece un zoom al mapa
  setZoom(t = {k: 1, x: 0, y: 0}) {
    this.transform = t
    this.repaint()
  }

  // "repinta" el svg (realmente utiliza la propiedad this.transform
  // para ajustar la posición de los cuadros)
  repaintSVG() {
    this.rects
      .attr('transform', (d: Point) => `translate(
        ${d.pos[0] * this.transform.k + this.transform.x},
        ${d.pos[1] * this.transform.k + this.transform.y})`)
  }

  // repinta el canvas
  repaintCanvas() {
    const context = this.canvas.node().getContext('2d')
    context.clearRect(0, 0, this.width, this.height)
    context.resetTransform()
    context.translate(this.transform.x, this.transform.y)
    context.scale(this.transform.k, this.transform.k)
    context.fillStyle = 'steelblue'
    context.fill(this.path2D)
  }

  // repinta el compoenente
  repaint(){
    this.repaintCanvas()
    this.repaintSVG()
  }
}

export default MapChart;