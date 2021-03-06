import * as d3 from 'd3'
import D3Element from '../D3Element'
import {Data, Point} from './Types'
import {Colors} from '../../assets/Contaminante'

class LineChart implements D3Element {

  readonly MARGIN = 0.05
  readonly POINT_RADIUS = 3
  static readonly COLORS = d3.schemeCategory10
  
  width: number
  height: number
  min: number
  data: Data
  svg = d3.create('svg')
    .attr("stroke-width", 1.5)
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .attr('fill', 'none')
  xScale = d3.scaleUtc()
  yScale = d3.scalePow()
    .exponent(0.5)
  xAxis = this.svg.append('g')
  yAxis = this.svg.append('g')
  line = this.svg.append('path')
  lines = this.svg.append('g')
  circles = this.svg.append('g')
    
  lineGenerator = d3.line<Point>()
    .x((d) => this.xScale(d.date))
    .y((d) => this.yScale(d.value))
    .defined(d => d.value != undefined || d.value < 0)
  limitLines = this.svg.append('g')
  colors = ['deepskyblue', 'mediumseagreen', 'coral', 'crimson', 'purple']

  repaint() {

    this.lines.selectAll('path')
      .data(this.data.points)
      .join('path')
      .datum(p => p)
      .attr('d', this.lineGenerator)
      .attr("stroke", (_,i) => LineChart.COLORS[i] )

    this.circles.selectAll('g')
      .data(this.data.points)
      .join('g')
      .attr('fill', (_,i) => LineChart.COLORS[i])
      .selectAll('circle')
      .data(d => d)
      .join('circle')
      .attr('cx', d => this.xScale(d.date))
      .attr('cy', d => this.yScale(d.value))
      .attr('r', 2.5)

    this.limitLines.selectAll('line')
      .data(this.data.contaminante.range)
      .join('line')
      .attr('x1', 0)
      .attr('x2', this.width)
      .attr('y1', d => this.yScale(d))
      .attr('y2', d => this.yScale(d))
      .attr("stroke", (n, i) => n >= this.min ? Colors[i] : null)

    this.xAxis
      .call(d3.axisBottom(this.xScale))

    const yAxis = d3.axisLeft(this.yScale)
    const yTicks = this.yScale.ticks()
    if(yTicks[0] != Math.round(this.min)) {
      yAxis.tickValues([this.min, ...yTicks])
    }
    this.yAxis
      .call(yAxis)
  }

  resize(width: number, height: number) {
    const leftMargin = width * this.MARGIN
    const topMargin = height * this.MARGIN
    this.width = width - leftMargin * 2
    this.height = height - topMargin * 2
    this.svg
      .attr("viewBox", `${-leftMargin} ${-topMargin} ${width} ${height}`)
      .attr('height', height)
      .attr('width', width)
      
    this.xAxis
      .attr("transform", `translate(0, ${this.height})`)
    this.xScale.range([0, this.width])
    this.yScale.range([this.height, 0])
  }

  setParent(node: HTMLElement) {
    node.append(this.svg.node())
  }

  setData(data: Data) {
    this.data = data;
    const minDate = d3.min(data.points, points => d3.min(points, p => p.date) );
    const maxDate = d3.max(data.points, points => d3.max(points, p => p.date) );
    this.xScale.domain([minDate, maxDate])
    this.min = d3.min(data.points, points => d3.min(points, p => p.value))
    const max = d3.max(data.points, points => d3.max(points, p => p.value))
    this.yScale.domain([this.min, max])
  }

}

export default LineChart;